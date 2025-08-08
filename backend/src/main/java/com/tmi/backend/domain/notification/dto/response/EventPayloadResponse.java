package com.tmi.backend.domain.notification.dto.response;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record EventPayloadResponse(
    Long notificationId,
    Long memberId,
    String content
) {

  public static EventPayloadResponse of(Long notificationId, Long memberId, String content) {
    return EventPayloadResponse.builder()
        .notificationId(notificationId)
        .memberId(memberId)
        .content(content)
        .build();
  }
}
