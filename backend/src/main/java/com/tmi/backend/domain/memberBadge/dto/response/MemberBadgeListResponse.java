package com.tmi.backend.domain.memberBadge.dto.response;

import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record MemberBadgeListResponse(List<SimpleMemberBadge> memberBadges) {

  public static MemberBadgeListResponse of(List<SimpleMemberBadge> memberBadges) {
    return MemberBadgeListResponse.builder().memberBadges(memberBadges).build();
  }

}
