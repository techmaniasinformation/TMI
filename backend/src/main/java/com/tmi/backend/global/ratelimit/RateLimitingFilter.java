package com.tmi.backend.global.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.domain.auth.jwt.provider.JwtTokenProvider;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import io.github.bucket4j.Bucket;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter implements Filter {

  private final RateLimiterService rateLimiterService;
  private final JwtTokenProvider jwtTokenProvider;
  private final ObjectMapper objectMapper;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;
    String token = extractToken(httpRequest);

    log.info("RateLimitingFilter invoked for URI: {}", httpRequest.getRequestURI());
    log.info("Extracted token: {}", token != null ? "FOUND" : "NOT FOUND");

    if (token != null) {
      if (!jwtTokenProvider.validateToken(token)) {
        log.warn("Invalid JWT token for request to {}", httpRequest.getRequestURI());
        writeErrorResponse(httpResponse, ErrorCode.AUTH_INVALID_TOKEN);
        return;
      }

      String userId = jwtTokenProvider.getSubject(token);
      Bucket bucket = rateLimiterService.resolveBucket(userId);

      if (bucket.tryConsume(1)) {
        log.info("userId: {}, remaining tokens: {}", userId, bucket.getAvailableTokens());
        chain.doFilter(request, response);
      } else {
        log.warn("userId: {}, token limit exceeded, remaining tokens: {}", userId,
            bucket.getAvailableTokens());
        writeErrorResponse(httpResponse, ErrorCode.AI_REQUEST_LIMIT_EXCEEDED);
      }
    } else {
      chain.doFilter(request, response);
    }
  }

  /**
   * Authorization 헤더나 쿠키에서 JWT 토큰 추출
   */
  private String extractToken(HttpServletRequest request) {
    // 1. Authorization 헤더 확인
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // 2. 쿠키에서 accessToken 확인
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if ("ACCESS_TOKEN".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }

    return null;
  }

  private void writeErrorResponse(HttpServletResponse response, ErrorCode errorCode)
      throws IOException {
    response.setStatus(errorCode.getHttpStatus().value());
    response.setContentType("application/json");
    response.getWriter().write(
        objectMapper.writeValueAsString(
            ServiceResult.fail(errorCode)
        )
    );
  }
}
