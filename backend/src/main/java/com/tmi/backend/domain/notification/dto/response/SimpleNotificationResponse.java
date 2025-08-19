package com.tmi.backend.domain.notification.dto.response;

import com.tmi.backend.domain.notification.entity.Notification;
import com.tmi.backend.domain.notification.entity.NotificationType;
import com.tmi.backend.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.Objects;
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

    Post post = notification.getPost();

    String profile = Objects.isNull(post) ? "" : (
        (post.getMember().getId() == 1 && !Objects.isNull(post.getCompany())) ?
            post.getCompany().getCompanyProfileUrl() : post.getMember().getMemberProfileUrl()
    );
    profile = Objects.isNull(profile) ? "" : profile;

    return SimpleNotificationResponse.builder()
        .notificationId(notification.getId())
        .notificationType(notification.getNotificationType())
        .content(notification.getContent())
        .postId(postId)
        .badgeUrl(badgeUrl)
        .memberProfileUrl(profile)
        .companyProfileUrl(profile)
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .build();
  }
}
