package com.tmi.backend.domain.member.entity;

import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
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
import java.time.ZoneOffset;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(name = "uk_provider_member", columnNames = {"provider",
        "provider_member_id"}),
    @UniqueConstraint(name = "uk_member_nickname", columnNames = "nickname")
})
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "member_id")
  private Long id;

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

  public static Member of(MemberCreateRequest req) {
    return Member.builder()
        .provider(req.provider())
        .providerMemberId(req.providerMemberId())
        .nickname(req.nickname())
        .memberProfileUrl(req.memberProfileUrl())
        .createdAt(LocalDateTime.now(ZoneOffset.UTC))
        .updatedAt(LocalDateTime.now(ZoneOffset.UTC))
        .build();
  }

  public void updateProfile(String nickname, String profileUrl, String blogUrl, String githubUrl) {
    this.nickname = nickname;
    this.memberProfileUrl = profileUrl;
    this.blogUrl = blogUrl();
    this.githubUrl = githubUrl();
    this.updatedAt = LocalDateTime.now(ZoneOffset.UTC);
  }

  public void addDeleteAt() {
    deletedAt = LocalDateTime.now(ZoneOffset.UTC);
  }

  public void reviveAndUpdate(MemberCreateRequest req) {
    nickname = req.nickname();
    memberProfileUrl = req.memberProfileUrl();
    deletedAt = null;
    createdAt = LocalDateTime.now(ZoneOffset.UTC);
    updatedAt = LocalDateTime.now(ZoneOffset.UTC);


  }

}
