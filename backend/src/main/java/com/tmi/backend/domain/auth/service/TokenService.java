package com.tmi.backend.domain.auth.service;

import com.tmi.backend.domain.auth.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

  private final JwtTokenProvider jwtTokenProvider;

  public void createAndAddAuthCookies(HttpServletResponse response, Long memberId) {
    String accessToken = jwtTokenProvider.createAccessToken(memberId);
    String refreshToken = jwtTokenProvider.createRefreshToken(memberId);

    //TODO : 배포전 활성화
    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
        .httpOnly(true)
//        .secure(true)
        .path("/")
        .sameSite("Strict")
        .build();

    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
        .httpOnly(true)                   // JavaScript에서 접근 불가 → XSS(크로스사이트스크립팅) 방지
//      .secure(true)                     // HTTPS 환경에서만 쿠키 전송 → MITM 방지
        .path("/api/v1/auth/refresh")     // 해당 경로로 요청할 때만 쿠키가 함께 전송됨 → 리프레시 전용 API에만 사용
        .maxAge(Duration.ofDays(14))      // 쿠키의 유효기간 설정 (14일 동안 브라우저 종료와 무관하게 유지됨)
        .sameSite("Strict")               // 다른 도메인에서 요청할 경우 쿠키 전송 안 함 → CSRF 공격 방어
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
  }

  public String getRefreshTokenFromCookie(HttpServletRequest req) {
    return Arrays.stream(Optional.ofNullable(req.getCookies()).orElse(new Cookie[0]))
        .filter(c -> "REFRESH_TOKEN".equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst()
        .orElse(null);
  }
}