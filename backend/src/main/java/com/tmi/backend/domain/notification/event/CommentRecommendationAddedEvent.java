package com.tmi.backend.domain.notification.event;

public record CommentRecommendationAddedEvent(
    Long recommendationId,
    Long memberId
) {
}
