package com.tmi.backend.domain.auth.oauth.handler;

import com.tmi.backend.domain.auth.jwt.service.TokenService;
import com.tmi.backend.domain.auth.oauth.util.CustomOauthUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final TokenService tokenService;

  @Value("${frontend.redirect-uri}")
  private String REDIRECT_URI;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) throws IOException {
    CustomOauthUser customUser = (CustomOauthUser) authentication.getPrincipal();

    // 신규 및 재가입 회원
    if (customUser.isNewUser()) {
      addCookie(response, "isNew", "true", false);
      addCookie(response, "provider", customUser.getProvider().name(), false);
      addCookie(response, "providerMemberId", customUser.getProviderMemberId(), false);

      String regToken = tokenService.createRegistrationToken(
          customUser.getProvider().name(),
          customUser.getProviderMemberId()
      );
      addCookie(response, "regToken", regToken, false);

    } else {
      // 기존 회원 - JWT 쿠키 설정
      tokenService.createAndAddAuthCookies(response, customUser.getMemberId());

      addCookie(response, "isNew", "false", false);
      addCookie(response, "memberId", String.valueOf(customUser.getMemberId()), false);
    }

    response.sendRedirect(REDIRECT_URI);
  }

  /**
   * 쿠키 설정 메서드
   * @param response HttpServletResponse
   * @param name     쿠키 이름
   * @param value    쿠키 값
   * @param httpOnly JS 접근 제한 여부 (true: access/refresh 쿠키에 사용)
   */
  private void addCookie(HttpServletResponse response, String name, String value,
      boolean httpOnly) {
    ResponseCookie cookie = ResponseCookie.from(name, value)
        .httpOnly(httpOnly)
        .secure(true)                     // HTTPS에서만 전송 (배포 시 필수)
        .sameSite("Strict")               // CSRF 방지
        .path("/")
        .maxAge(Duration.ofMinutes(5))  // 임시 쿠키, 짧게 유지
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}