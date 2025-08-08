package com.tmi.backend.domain.auth.jwt.service;

import com.tmi.backend.domain.auth.jwt.provider.JwtTokenProvider;
import com.tmi.backend.global.common.response.ServiceResult;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

  private final JwtTokenProvider jwtTokenProvider;
  private final RefreshTokenService refreshTokenService;

  public void createAndAddRegistCookie(HttpServletResponse response, String provider,
      String providerMemberId) {

    String registToken = jwtTokenProvider.createRegistToken(provider, providerMemberId);

    ResponseCookie registCookie = ResponseCookie.from("REGIST_TOKEN", registToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .domain("localhost")                //TODO : 프론트 개발 환경으로 변경(배포시 삭제)
        .maxAge(Duration.ofMinutes(5))
        .sameSite("None")                   // TODO : CSRF 방지(배포시 Strinct 로 변경)
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, registCookie.toString());

  }

  public ServiceResult<Map<String, Boolean>> createAndAddAuthCookies(HttpServletResponse response,
      Long memberId) {
    String accessToken = jwtTokenProvider.createAccessToken(memberId);
    String refreshToken = jwtTokenProvider.createRefreshToken(memberId);
    LocalDateTime expiresAt = jwtTokenProvider.getTokenExpiration(refreshToken);

    refreshTokenService.saveOrUpdateRefreshToken(memberId, refreshToken, expiresAt);

    //TODO : 배포전 활성화
    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .domain("localhost")                //TODO : 프론트 개발 환경으로 변경(배포시 삭제)
        .maxAge(Duration.ofDays(1))
        .sameSite("None")                   // TODO : CSRF 방지(배포시 Strinct 로 변경)
        .build();

    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .domain("localhost")                //TODO : 프론트 개발 환경으로 변경(배포시 삭제)
        .maxAge(Duration.ofDays(14))
        .sameSite("None")                   // TODO : CSRF 방지(배포시 Strinct 로 변경)
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

    return ServiceResult.ok(Map.of("isTokenCreated", true));
  }


  // 로그아웃시 토큰 삭제(= 유효기간 0)
  public void deleteAuthCookies(HttpServletResponse response) {
    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", "")
        .httpOnly(true)
        .path("/")
        .maxAge(0)
        .sameSite("None")                   // TODO : CSRF 방지(배포시 Strinct 로 변경)
        .build();

    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", "")
        .httpOnly(true)
        .path("/")
        .maxAge(0)
        .sameSite("None")                   // TODO : CSRF 방지(배포시 Strinct 로 변경)
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
  }

}