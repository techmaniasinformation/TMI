package com.tmi.backend.domain.member.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(name = "uk_provider_member", columnNames = {"provider",
        "provider_member_id"}),
    @UniqueConstraint(name = "uk_member_nickname", columnNames = "nickname")
})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long memberId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Provider provider; // ENUM: KAKAO, NAVER, GOOGLE

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

  private String deletedAt;

  private String createdAt;

  private String updatedAt;

  public static Member of(Provider provider, String providerMemberId, String nickname,
      String memberProfileUrl) {
    return Member.builder()
        .provider(provider)
        .providerMemberId(providerMemberId)
        .nickname(nickname)
        .memberProfileUrl(memberProfileUrl)
        .build();
  }

}
