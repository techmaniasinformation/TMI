package com.tmi.backend.domain.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
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

  @Column(nullable = false)
  private String createdAt;

  @Column(nullable = false)
  private String updatedAt;

}
