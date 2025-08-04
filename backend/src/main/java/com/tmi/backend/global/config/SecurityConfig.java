package com.tmi.backend.global.config;

import com.tmi.backend.domain.auth.jwt.JwtAuthenticationFilter;
import com.tmi.backend.domain.auth.oauth.handler.OAuth2FailureHandler;
import com.tmi.backend.domain.auth.oauth.handler.OAuth2SuccessHandler;
import com.tmi.backend.domain.auth.oauth.service.CustomOAuth2UserService;
import com.tmi.backend.domain.auth.oauth.service.CustomOidcUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final OAuth2SuccessHandler oAuth2SuccessHandler;
  private final OAuth2FailureHandler oAuth2FailureHandler;
  private final CustomOAuth2UserService customOAuth2UserService;
  private final CustomOidcUserService customOidcUserService;
  

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(HttpMethod.GET, "/api/v1/member/duplicate", "/api/v1/company/")
            .permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/auth/refresh", "/api/v1/member/signup")
            .permitAll()
            .requestMatchers(
                "/oauth2/**",         // 소셜 로그인 진입 및 콜백
                "/api/v1/auth/refresh",
                "/api/v1/oauth2/authorization/**",
                "/api/v1/oauth2/code/**"

            ).permitAll()
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth2 -> oauth2
            .authorizationEndpoint(endpoint -> endpoint
                .baseUri("/api/v1/oauth2/authorization")
            )
            .redirectionEndpoint(endpoint -> endpoint
                .baseUri("/api/v1/oauth2/code/*")
            )
            .userInfoEndpoint(userInfo -> userInfo
                .oidcUserService(customOidcUserService)
                .userService(customOAuth2UserService)
            )
            .successHandler(oAuth2SuccessHandler)
            .failureHandler(oAuth2FailureHandler)
        ).addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
