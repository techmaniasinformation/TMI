package com.tmi.backend.domain.memberBadge.dto.response;

import java.time.LocalDateTime;

public record SimpleMemberBadge(
    Long memberBadgeId,
    Long badgeId,
    LocalDateTime receivedAt
) {

}
