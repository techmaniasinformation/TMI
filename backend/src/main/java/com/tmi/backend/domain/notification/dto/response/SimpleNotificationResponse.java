package com.tmi.backend.domain.notification.dto.response;

import com.tmi.backend.domain.notification.entity.Notification;
import com.tmi.backend.domain.notification.entity.NotificationType;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record SimpleNotificationResponse(
    Long notificationId,
    NotificationType notificationType,
    String content,
    Long postId,
    String badgeUrl,
    String memberProfileUrl,
    String companyProfileUrl,
    boolean isRead,
    LocalDateTime createdAt
) {

  public static SimpleNotificationResponse from(Notification notification) {

    Long postId = notification.getPost() != null
        ? notification.getPost().getId()
        : null;

    String badgeUrl = notification.getBadge() != null
        ? notification.getBadge().getBadgeUrl()
        : null;

    String memberProfileUrl = null;
    String companyProfileUrl = null;

    return SimpleNotificationResponse.builder()
        .notificationId(notification.getId())
        .notificationType(notification.getNotificationType())
        .content(notification.getContent())
        .postId(postId)
        .badgeUrl(badgeUrl)
        .memberProfileUrl(memberProfileUrl)
        .companyProfileUrl(companyProfileUrl)
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .build();
  }
}
