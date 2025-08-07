package com.tmi.backend.domain.notification.event;

public record PostEvent(
    Long postId,
    Long postMemberId
) {
}
