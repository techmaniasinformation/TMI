package com.tmi.backend.domain.notification.event;

public record CommentCreatedEvent(
    Long postId,
    Long postMemberId,
    Long commentMemberId
) {
}
