package com.tmi.backend.global.auth;

import com.tmi.backend.global.jwt.JwtTokenProvider;
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

    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
        .httpOnly(true)
//        .secure(true) // https 만 허용-> MITM 방지(배포시 활성화)
        .path("/")
        .sameSite("Strict")
        .build();

    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
        .httpOnly(true)
//        .secure(true)
        .path("/api/v1/auth/refresh")
        .maxAge(Duration.ofDays(14))
        .sameSite("Strict")
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
  }
  
  String getRefreshTokenFromCookie(HttpServletRequest req) {
    return Arrays.stream(Optional.ofNullable(req.getCookies()).orElse(new Cookie[0]))
        .filter(c -> "REFRESH_TOKEN".equals(c.getName()))
        .map(Cookie::getValue)
        .findFirst()
        .orElse(null);
  }
}