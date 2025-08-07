package com.tmi.backend.domain.memberBadge.dto.response;

import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record MemberBadgeListResponse(List<SimpleMemberBadge> memberBadges) {

  public static MemberBadgeListResponse of(List<MemberBadge> memberBadges) {
    List<SimpleMemberBadge> dtoList = memberBadges.stream()
        .map(SimpleMemberBadge::from)
        .collect(Collectors.toList());

    return MemberBadgeListResponse.builder()
        .memberBadges(dtoList)
        .build();
  }

}
