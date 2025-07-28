package com.tmi.backend.domain.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(name = "uk_provider_member", columnNames = {"provider",
        "provider_member_id"}),
    @UniqueConstraint(name = "uk_member_nickname", columnNames = "nickname")
})
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long memberId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Provider provider; // ENUM: KAKAO, NAVER, GOOGLE, ADMIN

  @Column(nullable = false, length = 100)
  private String providerMemberId;

  @Column(nullable = false, length = 8)
  private String nickname;

  @Column(length = 255)
  private String memberProfileUrl;

  @Column(length = 255)
  private String blogUrl;

  @Column(length = 255)
  private String githubUrl;

  private LocalDateTime deletedAt;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  public static Member of(Provider provider, String providerMemberId, String nickname,
      String memberProfileUrl) {
    return Member.builder()
        .provider(provider)
        .providerMemberId(providerMemberId)
        .nickname(nickname)
        .memberProfileUrl(memberProfileUrl)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
  }

  public void delete() {
    deletedAt = LocalDateTime.now();
  }

  public void reviveAndUpdate() {
    deletedAt = null;
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();

  }

}
