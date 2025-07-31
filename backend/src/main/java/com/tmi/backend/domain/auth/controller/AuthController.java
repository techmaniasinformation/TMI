package com.tmi.backend.domain.auth.controller;

import com.tmi.backend.domain.auth.jwt.JwtTokenProvider;
import com.tmi.backend.domain.auth.service.TokenService;
import com.tmi.backend.domain.auth.util.CustomUserDetails;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiErrorResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import com.tmi.backend.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final JwtTokenProvider jwtTokenProvider;
  private final TokenService tokenService;

  /**
   * 토큰발급 API
   */
  @PostMapping("/refresh")
  public ApiResponse<?> refreshToken(HttpServletRequest request,
      HttpServletResponse response) {
    String refreshToken = tokenService.getRefreshTokenFromCookie(request);
    if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
      return ApiErrorResponse.error(ErrorCode.AUTH_INVALID_TOKEN);
    }

    Long memberId = ((CustomUserDetails) jwtTokenProvider.getAuthentication(refreshToken)
        .getPrincipal()).getMemberId();

    tokenService.createAndAddAuthCookies(response, memberId);
    return ApiSuccessResponse.success(Map.of("isTokenCreated", true));
  }
}



