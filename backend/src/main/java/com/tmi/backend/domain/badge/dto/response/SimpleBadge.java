package com.tmi.backend.domain.badge.dto.response;

import com.tmi.backend.domain.badge.entity.Badge;
import java.util.List;

public record SimpleBadge(
    Long badgeId,
    String name,
    String description,
    String badgeUrl
) {

  public static SimpleBadge from(Badge badge) {
    return new SimpleBadge(badge.getId(), badge.getName(), badge.getDescription(),
        badge.getBadgeUrl());
  }

  public static List<SimpleBadge> from(List<Badge> badges) {
    return badges.stream().map(SimpleBadge::from).toList();
  }
}