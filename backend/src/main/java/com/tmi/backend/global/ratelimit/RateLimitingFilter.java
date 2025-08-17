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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

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
    String authHeader = httpRequest.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);

      if (!jwtTokenProvider.validateToken(token)) {
        httpResponse.setStatus(ErrorCode.AUTH_INVALID_TOKEN.getHttpStatus().value());
        httpResponse.setContentType("application/json");
        httpResponse.getWriter().write(
            objectMapper.writeValueAsString(
                ServiceResult.fail(ErrorCode.AUTH_INVALID_TOKEN)
            )
        );
        return;
      }

      String userId = jwtTokenProvider.getSubject(token);
      Bucket bucket = rateLimiterService.resolveBucket(userId);

      if (bucket.tryConsume(1)) {
        chain.doFilter(request, response);
      } else {
        httpResponse.setStatus(ErrorCode.AI_REQUEST_LIMIT_EXCEEDED.getHttpStatus().value());
        httpResponse.setContentType("application/json");
        httpResponse.getWriter().write(
            objectMapper.writeValueAsString(
                ServiceResult.fail(ErrorCode.AI_REQUEST_LIMIT_EXCEEDED)
            )
        );
      }
    } else {
      chain.doFilter(request, response);
    }
  }
}