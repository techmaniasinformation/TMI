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
@Setter // TODO : 삭제하기 -> 필요시 명시적으로 쓰기
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

  // TODO : 파라미터 개수에 따라 이름 짓기 of(여러개), from(한개)
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

  //TODO : 메서드명 명확히 바꾸기
  public void delete() {
    deletedAt = LocalDateTime.now();
  }

  public void reviveAndUpdate() {
    deletedAt = null;
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();

  }

}
