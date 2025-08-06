package com.tmi.backend.domain.follow.member.dto.response;

import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import com.tmi.backend.domain.member.entity.Member;

public record SimpleMemberFollow(Long memberFollowId,
                                 Long memberId,
                                 String nickname,
                                 String memberProfileUrl,
                                 String badgeUrl) {

  public static SimpleMemberFollow from(MemberFollow mf, String badgeUrl) {
    Member member = mf.getFollowee();
    return new SimpleMemberFollow(
        mf.getId(),
        member.getId(),
        member.getNickname(),
        member.getMemberProfileUrl(),
        badgeUrl
    );
  }
}
