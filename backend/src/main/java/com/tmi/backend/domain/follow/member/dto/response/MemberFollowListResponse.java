package com.tmi.backend.domain.follow.member.dto.response;

import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;

public record MemberFollowListResponse(
    List<SimpleMemberFollow> memberFollows,
    PageDetail pageInfo
) {

  public static MemberFollowListResponse from(
      Page<MemberFollow> page,
      Map<Long, String> badgeMap
  ) {
    List<SimpleMemberFollow> dtos = page.getContent().stream()
        .map(mf -> SimpleMemberFollow.from(
            mf,
            badgeMap.get(mf.getFollowee().getId())
        ))
        .toList();

    PageDetail pageDetail = PageDetail.of(
        page.getTotalElements(),
        page.getTotalPages(),
        page.isLast(),
        page.getNumber()
    );

    return new MemberFollowListResponse(dtos, pageDetail);
  }
}
