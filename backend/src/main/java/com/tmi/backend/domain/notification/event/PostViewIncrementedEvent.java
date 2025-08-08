package com.tmi.backend.domain.notification.event;

public record PostViewIncrementedEvent(
    Long postId,
    Long postMemberId,
    int viewCount
) {
}
