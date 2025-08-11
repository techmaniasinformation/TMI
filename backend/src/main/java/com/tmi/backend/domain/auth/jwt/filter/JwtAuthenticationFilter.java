package com.tmi.backend.domain.auth.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.domain.auth.jwt.provider.JwtTokenProvider;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiErrorResponse;
import com.tmi.backend.global.error.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * HTTP 요청에서 JWT를 꺼내 검증하고 Authentication을 SecurityContext에 설정
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenProvider jwtTokenProvider;
  private final ObjectMapper objectMapper;
  private static final PathPatternRequestMatcher.Builder PP =
      PathPatternRequestMatcher.withDefaults();

  private final RequestMatcher publicEndpoints = new OrRequestMatcher(
      PP.matcher(HttpMethod.GET, "/api/v1/**"),

      // 공개 POST (회원가입/재발급/로그아웃)
      PP.matcher(HttpMethod.POST, "/api/v1/member/signup"),
      PP.matcher(HttpMethod.POST, "/api/v1/auth/refresh"),
      PP.matcher(HttpMethod.POST, "/api/v1/auth/logout/**"),

      // OAuth2 엔드포인트 (메서드 구분 불필요하면 오버로드로 method 생략 가능)
      PP.matcher("/api/v1/oauth2/**"),
      PP.matcher("/oauth2/**"),
      PP.matcher("/api/v1/oauth2/authorization/**"),
      PP.matcher("/api/v1/oauth2/code/**"),
      PP.matcher("/login/oauth2/code/**"),
      PP.matcher("/login")
  );

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    // CORS Preflight는 항상 스킵
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      return true;
    }
    // 공개 경로면 JWT 필터 자체를 건너뜀
    return publicEndpoints.matches(request);
  }


  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    //ACCESS-TOKEN 가져오기
    String token = resolveAccessToken(request);

    if (token != null) {
      if (jwtTokenProvider.validateToken(token)) {
        Authentication auth = jwtTokenProvider.getAuthentication(token);

        // 토큰을 기반으로 인증 객체 저장
        SecurityContextHolder.getContext().setAuthentication(auth);
      } else {

        ApiResponse<Void> errorResponse = ApiErrorResponse.error(ErrorCode.AUTH_INVALID_TOKEN);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), errorResponse);
        return;
      }
    }

    filterChain.doFilter(request, response);
  }

  /**
   * 쿠키에서 ACCESS_TOKEN 추출하는 API
   */
  private String resolveAccessToken(HttpServletRequest request) {
    if (request.getCookies() == null) {
      return null;
    }
    return Arrays.stream(request.getCookies())
        .filter(c -> "ACCESS_TOKEN".equals(c.getName()))
        .findFirst()
        .map(Cookie::getValue)
        .orElse(null);
  }
}
