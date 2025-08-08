package com.tmi.backend.domain.notification.event;

public record PostCreatedEvent(
    Long postId,
    Long postCompanyId,
    Long postMemberId
) {
}
