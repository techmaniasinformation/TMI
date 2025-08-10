package com.tmi.backend.domain.auth.jwt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RefreshToken {

  @Id
  private Long memberId;

  @Column(nullable = false, length = 512)
  private String token;

  @Column(nullable = false)
  private LocalDateTime expiresAt;

  public static RefreshToken of(
      Long memberId, String token,
      LocalDateTime expriresAt
  ) {
    return RefreshToken.builder().memberId(memberId).token(token).expiresAt(expriresAt).build();
  }

  public void update(String newToken, LocalDateTime newExpiresAt) {
    this.token = newToken;
    this.expiresAt = newExpiresAt;
  }
}
