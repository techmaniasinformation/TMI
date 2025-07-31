package com.tmi.backend.domain.notification.entity;

import com.tmi.backend.domain.badge.entity.Badge;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "notification_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private NotificationType notificationType;

  @Column(length = 255)
  private String content;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id")
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "badge_id")
  private Badge badge;

  @Builder.Default
  @Column(nullable = false)
  private Boolean isRead = false;

  private LocalDateTime createdAt;

  public static Notification of(Member member, NotificationType type, String content, Post post,
      Badge badge) {
    return Notification.builder()
        .member(member)
        .notificationType(type)
        .content(content)
        .post(post)
        .badge(badge)
        .isRead(false)
        .build();
  }
}
