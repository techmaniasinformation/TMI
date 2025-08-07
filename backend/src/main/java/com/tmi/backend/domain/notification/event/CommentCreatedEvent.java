package com.tmi.backend.domain.notification.event;

public record CommentCreatedEvent(
    Long postMemberId,
    Long commentMemberId
) {
}
