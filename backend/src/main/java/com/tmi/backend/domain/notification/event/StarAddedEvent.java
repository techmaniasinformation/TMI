package com.tmi.backend.domain.notification.event;

public record StarAddedEvent(
    Long starId,
    Long postId,
    Long memberId
) {
}
