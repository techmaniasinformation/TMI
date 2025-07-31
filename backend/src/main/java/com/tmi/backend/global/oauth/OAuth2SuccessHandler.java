package com.tmi.backend.global.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import com.tmi.backend.global.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final JwtTokenProvider jwtTokenProvider;
  private final ObjectMapper objectMapper;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) {
    CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();

    // 신규회원
    if (customUser.isNewUser()) {
      ApiResponse<Object> apiResponse = ApiSuccessResponse.success(
          Map.of(
              "isNew", true,
              "provider", customUser.getProvider(),
              "providerMemberId", customUser.getProviderMemberId()
          )
      );
      writeJsonResponse(response, apiResponse);
      return;
    }

    //TODO : 회원가입 후 발급해야하니 나중에 로직 따로 빼기
    //TODO : 배포시 .secure(true)로 설정 바꾸기.
    // 기존 회원: AccessToken + RefreshToken 발급
    String accessToken = jwtTokenProvider.createAccessToken(customUser.getMemberId());
    String refreshToken = jwtTokenProvider.createRefreshToken(customUser.getMemberId());
    // 쿠키 생성 (세션 쿠키로, 브라우저 종료 시 자동 삭제)
    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
        .httpOnly(true)                   // 자바스크립트 접근 차단 → XSS 완화
//        .secure(true)                   // HTTPS일 때만 전송 → MITM 방어
        .path("/")                        // 쿠키 적용 경로
        .sameSite("Strict")               // CSRF 방어
        .build();

    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
        .httpOnly(true)
//        .secure(true)
        .path("/api/v1/auth/refresh")            // 리프레시 전용 엔드포인트에만 전송
        .maxAge(Duration.ofDays(14))      // 영구 쿠키 : 브라우저 종료시 삭제 안되도록 설정
        .sameSite("Strict")
        .build();

    // Set-Cookie 헤더에 추가
    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

    ApiResponse<Object> apiResponse = ApiSuccessResponse.success(
        Map.of(
            "isNew", false,
            "memberId", customUser.getMemberId()
        )
    );
    writeJsonResponse(response, apiResponse);
  }

  private void writeJsonResponse(HttpServletResponse response, ApiResponse<Object> apiResponse) {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.setStatus(HttpServletResponse.SC_OK);
    try {
      response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    } catch (IOException e) {
      throw new RuntimeException("응답 출력 중 오류 발생", e);
    }
  }
}
