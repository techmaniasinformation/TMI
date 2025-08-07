package com.tmi.backend.domain.notification.event;

public record PostCreatedEvent(
    Long postCompanyId,
    Long postMemberId
) {
}
