package com.tmi.backend.domain.notification.entity;


import com.tmi.backend.domain.badge.entity.Badge;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long notificationId;

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

  private Boolean isRead;

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
