package com.tmi.backend.domain.notification.event;

public record CommentCreatedEvent(
    Long commentId,
    Long postId,
    Long memberId
) {
}
