package com.tmi.backend.domain.auth.jwt.service;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import com.tmi.backend.domain.auth.jwt.repository.RefreshTokenRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;

  public void saveOrUpdateRefreshToken(Long memberId, String token, LocalDateTime expiresAt) {
    RefreshToken refreshToken = refreshTokenRepository.findById(memberId)
        .map(rt -> {
          rt.update(token, expiresAt);
          return rt;
        })
        .orElse(RefreshToken.of(memberId, token, expiresAt));

    refreshTokenRepository.save(refreshToken);

  }

  public RefreshToken findByMemberId(Long memberId) {

    // DB에서 조회
    RefreshToken fromDb = refreshTokenRepository.findByMemberId(memberId);
    if (fromDb == null) {
      return null;
    }

    LocalDateTime nowUtc = LocalDateTime.now(ZoneOffset.UTC);
    if (fromDb.getExpiresAt().isBefore(nowUtc)) {
      refreshTokenRepository.deleteById(memberId);
    }
    return fromDb;
  }

  public void deleteByMemberId(Long memberId) {
    refreshTokenRepository.deleteById(memberId);
  }
}