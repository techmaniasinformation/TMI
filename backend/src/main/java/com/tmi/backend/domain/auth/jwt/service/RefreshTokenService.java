package com.tmi.backend.domain.auth.jwt.service;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public interface RefreshTokenService {

  void saveOrUpdateRefreshToken(Long memberId, String token, LocalDateTime expiresAt);

  RefreshToken findByMemberId(Long memberId);

  void deleteByMemberId(Long memberId);
}