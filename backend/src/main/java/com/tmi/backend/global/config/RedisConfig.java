package com.tmi.backend.global.config;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class RedisConfig {

  @Value("${spring.data.redis.host}")
  private String redisHost;

  @Value("${spring.data.redis.port}")
  private int redisPort;

  @Bean
  public RedisConnectionFactory redisConnectionFactory() {
    return new LettuceConnectionFactory(redisHost, redisPort);
  }

  @Bean
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory cf) {
    RedisTemplate<String, Object> t = new RedisTemplate<>();
    t.setConnectionFactory(cf);
    var serializer = new GenericJackson2JsonRedisSerializer();
    t.setKeySerializer(new StringRedisSerializer());
    t.setHashKeySerializer(new StringRedisSerializer());
    t.setValueSerializer(serializer);
    t.setHashValueSerializer(serializer);
    t.afterPropertiesSet();
    return t;
  }

  @Bean
  public CacheManager cacheManager(RedisConnectionFactory cf) {
    RedisCacheConfiguration base = RedisCacheConfiguration.defaultCacheConfig()
        .disableCachingNullValues()
        .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
        .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));

    // 캐시별 TTL
    Map<String, RedisCacheConfiguration> conf = new HashMap<>();
    conf.put("post:latest",  base.entryTtl(Duration.ofSeconds(15)));
    conf.put("post:popular", base.entryTtl(Duration.ofSeconds(60 * 9)));
    conf.put("post:detail",  base.entryTtl(Duration.ofSeconds(30)));

    return RedisCacheManager.builder(cf)
        .cacheDefaults(base)
        .withInitialCacheConfigurations(conf)
        .transactionAware()
        .build();
  }

  // 페이지 키 생성기: v1:{args...}
  @Bean("pageKeyGen")
  public KeyGenerator pageKeyGen() {
    return (target, method, params) -> {
      String joined = Arrays.stream(params)
          .map(String::valueOf)
          .collect(Collectors.joining(":"));
      return "v1:" + joined;
    };
  }
}
