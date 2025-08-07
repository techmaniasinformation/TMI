package com.tmi.backend.domain.notification.dto.response;

import com.tmi.backend.domain.notification.entity.Notification;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;

@Builder
public record NotificationListResponse(
    List<SimpleNotificationResponse> content
) {

  public static NotificationListResponse from(List<Notification> notifications) {
    List<SimpleNotificationResponse> responses = notifications.stream()
        .map(SimpleNotificationResponse::from)
        .collect(Collectors.toList());
    return new NotificationListResponse(responses);
  }
}
