package com.tmi.backend.global.config;

import com.tmi.backend.global.ratelimit.RateLimitingFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RateLimitingConfig {

  private final RateLimitingFilter rateLimitingFilter;

  @Bean
  public FilterRegistrationBean<RateLimitingFilter> rateLimiterFilter() {
    FilterRegistrationBean<RateLimitingFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(rateLimitingFilter);
    registrationBean.addUrlPatterns("/api/v1/summary"); // 제한 적용할 URL
    return registrationBean;
  }
}
