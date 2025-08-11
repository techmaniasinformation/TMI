package com.tmi.backend.domain.auth.controller;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import com.tmi.backend.domain.auth.jwt.provider.JwtTokenProvider;
import com.tmi.backend.domain.auth.jwt.service.RefreshTokenService;
import com.tmi.backend.domain.auth.jwt.service.TokenService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import com.tmi.backend.global.error.ErrorCode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController implements BaseController {

  private final JwtTokenProvider jwtTokenProvider;
  private final TokenService tokenService;
  private final RefreshTokenService refreshTokenService;


  /**
   * 토큰 재발급 API
   */
  @PostMapping("/refresh")
  public ResponseEntity<ApiResponse<Map<String, Boolean>>> refreshToken(HttpServletRequest request,
      HttpServletResponse response) {

    //쿠키에서 리프레시 토큰 추출
    String refreshToken = Optional.ofNullable(request.getCookies())
        .stream()
        .flatMap(Arrays::stream)
        .filter(c -> "REFRESH_TOKEN".equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst()
        .orElse(null);

    // 쿠키에 없거나 유효하지 않으면 에러
    if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
      return handle(ServiceResult.fail(ErrorCode.AUTH_INVALID_TOKEN));
    }

    //리프레스 토큰에서 사용자 id 추출
    Long memberId = Long.parseLong(jwtTokenProvider.getSubject(refreshToken));

    //db에 저장된 리프레시 토큰 가져오기.
    RefreshToken savedToken = refreshTokenService.findByMemberId(memberId);

    //저장된것과 비교
    if (savedToken == null || !savedToken.getToken().equals(refreshToken)) {
      return handle(ServiceResult.fail(ErrorCode.AUTH_INVALID_TOKEN));
    }

    //만료 여부 확인
    if (savedToken.getExpiresAt().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
      return handle(ServiceResult.fail(ErrorCode.AUTH_INVALID_TOKEN));
    }

    return handle(tokenService.createAndAddAuthCookies(response, memberId));
  }

  /**
   * 로그아웃 API
   */
  @PostMapping("/logout/{memberId}")
  public ApiResponse<?> logout(@PathVariable Long memberId, HttpServletRequest request,
      HttpServletResponse response) {
    // DB에서 리프레시 토큰 제거
    refreshTokenService.deleteByMemberId(memberId);
    // 쿠키에서 리프레시 토큰 삭제 ( = 유효기간 0으로 설정)
    tokenService.deleteAuthCookies(response);
    return ApiSuccessResponse.success(Map.of("isLoggedOut", true));
  }


}



