package com.tmi.backend.global.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.global.auth.TokenService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final TokenService tokenService;
  private final ObjectMapper objectMapper;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication) {
    CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();

    // 신규 및 재가입 회원
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

    //기존회원
    tokenService.createAndAddAuthCookies(response, customUser.getMemberId());
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
      throw new RuntimeException("JSON 응답 중 에러 발생");
    }
  }

}