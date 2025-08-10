package com.tmi.backend.domain.badge.dto.response;


import java.util.List;

public record BadgeListResponse(
    List<SimpleBadge> badges
) {

  public static BadgeListResponse from(List<SimpleBadge> simpleBadges) {
    return new BadgeListResponse(simpleBadges);
  }
}
