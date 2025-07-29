package com.tmi.backend.domain.memberBadge.entity;

import com.tmi.backend.domain.badge.entity.Badge;
import com.tmi.backend.domain.member.entity.Member;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member_badge", uniqueConstraints = {
    @UniqueConstraint(name = "uk_member_badge", columnNames = {"member_id", "badge_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class MemberBadge {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long memberBadgeId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false, foreignKey = @ForeignKey(name = "fk_member_badge_member"))
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "badge_id", nullable = false, foreignKey = @ForeignKey(name = "fk_member_badge_badge"))
  private Badge badge;

  private LocalDateTime receivedAt;

  private Boolean isRepresentative;

  public static MemberBadge of(Member member, Badge badge) {
    return MemberBadge.builder()
        .member(member)
        .badge(badge)
        .build();
  }
}
