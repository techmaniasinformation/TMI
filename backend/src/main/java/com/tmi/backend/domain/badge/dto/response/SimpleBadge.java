package com.tmi.backend.domain.badge.dto.response;

public record SimpleBadge(
    Long badgeId,
    String name,
    String description,
    String badgeUrl
) {

}
