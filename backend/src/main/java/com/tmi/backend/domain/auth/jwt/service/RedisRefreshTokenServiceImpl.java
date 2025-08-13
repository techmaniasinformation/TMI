package com.tmi.backend.domain.auth.jwt.service;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import com.tmi.backend.domain.auth.jwt.repository.RedisRefreshTokenRepository;
import com.tmi.backend.domain.auth.jwt.repository.RefreshTokenRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Primary
@Transactional
public class RedisRefreshTokenServiceImpl implements RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;
  private final RedisRefreshTokenRepository redisRefreshTokenRepository;


  public void saveOrUpdateRefreshToken(Long memberId, String token, LocalDateTime expiresAt) {
    RefreshToken refreshToken = refreshTokenRepository.findById(memberId)
        .map(rt -> {
          rt.update(token, expiresAt);
          return rt;
        })
        .orElse(RefreshToken.of(memberId, token, expiresAt));

    refreshTokenRepository.save(refreshToken);
    redisRefreshTokenRepository.save(refreshToken);

  }

  public RefreshToken findByMemberId(Long memberId) {
    // 1) Redis 캐시 조회
    RefreshToken cached = redisRefreshTokenRepository.findByMemberId(memberId);
    if (cached != null) {
      return cached;
    }

    // 2) DB에서 조히
    RefreshToken fromDb = refreshTokenRepository.findByMemberId(memberId);
    if (fromDb == null) {
      return null;
    }

    LocalDateTime nowUtc = LocalDateTime.now(ZoneOffset.UTC);
    if (fromDb.getExpiresAt() == null || fromDb.getExpiresAt().isAfter(nowUtc)) {
      // 유효하면 캐시에 채움(키에 TTL 설정됨)
      redisRefreshTokenRepository.save(fromDb);
    } else {
      // 만료된 경우 캐시는 비움(선택적으로 DB도 정리 가능)
      redisRefreshTokenRepository.deleteById(memberId);
      refreshTokenRepository.deleteById(memberId);
    }
    return fromDb;
  }

  /**
   * 삭제: DB와 Redis 모두 삭제
   */
  public void deleteByMemberId(Long memberId) {
    refreshTokenRepository.deleteById(memberId);
    redisRefreshTokenRepository.deleteById(memberId);
  }
}