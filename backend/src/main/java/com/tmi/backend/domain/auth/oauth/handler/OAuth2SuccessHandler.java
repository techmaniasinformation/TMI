package com.tmi.backend.domain.auth.oauth.handler;

import com.tmi.backend.domain.auth.jwt.service.TokenService;
import com.tmi.backend.domain.auth.oauth.util.CustomOauthUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final TokenService tokenService;

  @Value("${frontend.redirect-uri}")
  private String REDIRECT_URI;

  private String targetUrl;


  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) throws IOException {
    CustomOauthUser customUser = (CustomOauthUser) authentication.getPrincipal();

    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate();
    }

    // JSESSIONID 쿠키 완전 삭제
    Cookie jsessionCookie = new Cookie("JSESSIONID", null);
    jsessionCookie.setMaxAge(0);
    jsessionCookie.setPath("/");
    jsessionCookie.setHttpOnly(true);
    response.addCookie(jsessionCookie);

    // 신규 및 재가입 회원
    if (customUser.isNewUser()) {
      targetUrl = UriComponentsBuilder.fromHttpUrl(REDIRECT_URI)
          .queryParam("isNew", true)
          .queryParam("provider", customUser.getProvider().name()) // 한글, 특수문자는 자동으로 URL 인코딩 됨
          .queryParam("providerMemberId",
              customUser.getProviderMemberId()) // 한글, 특수문자는 자동으로 URL 인코딩 됨
          .toUriString();

      tokenService.createAndAddRegistCookie(response,
          customUser.getProvider().name(),
          customUser.getProviderMemberId()
      );

    } else {
      // 기존 회원 - JWT 쿠키 설정
      targetUrl = UriComponentsBuilder.fromHttpUrl(REDIRECT_URI)
          .queryParam("isNew", false)
          .queryParam("memberId", customUser.getMemberId())
          .toUriString();

      tokenService.createAndAddAuthCookies(response, customUser.getMemberId());
    }
    response.sendRedirect(targetUrl);
  }
}