package com.tmi.backend.domain.memberBadge.dto.response;

import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import java.time.LocalDateTime;

public record SimpleMemberBadge(
    Long memberBadgeId,
    Long badgeId,
    LocalDateTime receivedAt
) {

  public static SimpleMemberBadge from(MemberBadge entity) {
    return new SimpleMemberBadge(
        entity.getId(),
        entity.getBadge().getId(),
        entity.getReceivedAt()
    );
  }
}
