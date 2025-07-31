package com.tmi.backend.global.auth;

import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import com.tmi.backend.global.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final JwtTokenProvider jwtTokenProvider;

  @PostMapping("/refresh")
  public ApiResponse<?> refreshToken(HttpServletRequest request,
      HttpServletResponse response) {
    // 1) 리프레시 토큰 쿠키 파싱
    String refreshToken = Arrays.stream(
            Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
        .filter(c -> "REFRESH_TOKEN".equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst()
        //TODO : 에러 처리 수정하기
        .orElseThrow(() -> new RuntimeException("리프레시 토큰 누락"));

    // 2) 유효성 검증
    if (!jwtTokenProvider.validateToken(refreshToken)) {
      //TODO : 에러 처리 수정하기
      throw new RuntimeException("유효하지 않은 리프레시 토큰");
    }

    // 리프레시 토큰으로 인증 정보 얻기
    Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

    // 토큰 생성할 사용자 ID(=memberId) 추출 (UserDetails 에 따라 캐스팅)
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    Long memberId = userDetails.getMemberId();

    // ID 기반으로 토큰 생성
    String newAccess = jwtTokenProvider.createAccessToken(memberId);
    String newRefresh = jwtTokenProvider.createRefreshToken(memberId);

    // 쿠키로 담아 응답
    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", newAccess)
        .httpOnly(true).secure(true).path("/").sameSite("Strict").build();
    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", newRefresh)
        .httpOnly(true).secure(true).path("/auth/refresh").maxAge(Duration.ofDays(14))
        .sameSite("Strict").build();

    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

    return ApiSuccessResponse.success(Map.of("isTokenCreated", true));
  }
}

