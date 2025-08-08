package com.tmi.backend.domain.auth.jwt.repository;

import com.tmi.backend.domain.auth.jwt.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

  RefreshToken findByMemberId(Long memberId);
}