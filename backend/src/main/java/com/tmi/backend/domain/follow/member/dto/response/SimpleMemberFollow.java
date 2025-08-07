package com.tmi.backend.domain.follow.member.dto.response;

public record SimpleMemberFollow(Long memberFollowId,
                                 Long memberId,
                                 String nickname,
                                 String memberProfileUrl,
                                 String badgeUrl) {

}
