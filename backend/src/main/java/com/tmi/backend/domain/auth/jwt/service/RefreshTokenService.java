package com.tmi.backend.domain.auth.jwt.service;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import com.tmi.backend.domain.auth.jwt.repository.RefreshTokenRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;

  //
  public void saveOrUpdateRefreshToken(Long memberId, String token, LocalDateTime expiresAt) {
    RefreshToken refreshToken = refreshTokenRepository.findById(memberId)
        .map(rt -> {
          rt.update(token, expiresAt);
          return rt;
        })
        .orElse(RefreshToken.of(memberId, token, expiresAt));

    refreshTokenRepository.save(refreshToken);
  }

  public Optional<RefreshToken> findByMemberId(Long memberId) {
    return refreshTokenRepository.findById(memberId);
  }

  public void deleteByMemberId(Long memberId) {
    refreshTokenRepository.deleteById(memberId);
  }
}