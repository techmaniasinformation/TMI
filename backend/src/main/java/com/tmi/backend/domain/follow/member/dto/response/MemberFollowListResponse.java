package com.tmi.backend.domain.follow.member.dto.response;

import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;

public record MemberFollowListResponse(
    List<SimpleMemberFollow> memberFollows,
    PageDetail pageInfo
) {

  public static MemberFollowListResponse of(List<SimpleMemberFollow> memberFollows,
      PageDetail pageInfo) {
    return new MemberFollowListResponse(memberFollows, pageInfo);
  }
}