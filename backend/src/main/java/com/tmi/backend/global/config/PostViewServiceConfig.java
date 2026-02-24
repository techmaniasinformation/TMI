package com.tmi.backend.global.config;

import com.tmi.backend.domain.post.service.PostViewService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class PostViewServiceConfig {

  @Bean
  @Primary
  public PostViewService postViewServiceSelector(
      @Qualifier("postViewLegacyService") PostViewService legacyService,
      @Qualifier("postViewCacheService") PostViewService cacheService,
      @Value("${feature.post-view-cache.enabled:false}") boolean cacheEnabled
  ) {
    return cacheEnabled ? cacheService : legacyService;
  }
}
