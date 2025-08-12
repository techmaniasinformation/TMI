package com.tmi.backend.domain.auth.jwt.repository;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RedisRefreshTokenRepository {

  private final StringRedisTemplate redis;

  private String key(Long memberId) {
    return "rt:m:" + memberId;
  }

  public Optional<RefreshToken> findById(Long memberId) {
    String token = redis.opsForValue().get(key(memberId));
    if (token == null) {
      return Optional.empty();
    }
    return Optional.of(RefreshToken.of(memberId, token, resolveExpiresAt(memberId)));
  }

  public RefreshToken findByMemberId(Long memberId) {
    String token = redis.opsForValue().get(key(memberId));
    if (token == null) {
      return null;
    }
    return RefreshToken.of(memberId, token, resolveExpiresAt(memberId));
  }

  public RefreshToken save(RefreshToken entity) {
    Instant now = Instant.now();
    Instant exp = entity.getExpiresAt() == null
        ? now : entity.getExpiresAt().atZone(ZoneOffset.UTC).toInstant();
    long ttlSec = Math.max(1, ChronoUnit.SECONDS.between(now, exp));
    redis.opsForValue().set(key(entity.getMemberId()), entity.getToken(), ttlSec, TimeUnit.SECONDS);
    return entity;
  }

  public void deleteById(Long memberId) {
    redis.delete(key(memberId));
  }

  private LocalDateTime resolveExpiresAt(Long memberId) {
    Long ttlSec = redis.getExpire(key(memberId), TimeUnit.SECONDS);
    if (ttlSec == null || ttlSec <= 0) {
      return null;
    }
    return LocalDateTime.now(ZoneOffset.UTC).plusSeconds(ttlSec);
  }


}