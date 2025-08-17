package com.tmi.backend.global.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RateLimiterService {

  private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

  public Bucket resolveBucket(String userId) {
    Bucket bucket = cache.computeIfAbsent(userId, this::newBucket);
    log.info("userId: {}, bucket hash: {}, available tokens: {}",
        userId, System.identityHashCode(bucket), bucket.getAvailableTokens());
    return bucket;
  }


  private Bucket newBucket(String userId) {
    Bandwidth limit = Bandwidth.builder()
        .capacity(3) // 최대 3회
        .refillIntervally(3, Duration.ofDays(1)) // 하루 단위로 3개 리필
        .build();

    return Bucket.builder()
        .addLimit(limit)
        .build();
  }
}

