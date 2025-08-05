package com.tmi.backend.domain.member.dto.response;

import com.tmi.backend.domain.member.entity.Member;

public record MemberResponse(
    Long memberId,
    String nickname,
    String memberProfileUrl,
    String blogUrl,
    String githubUrl,
    MemberStats memberStats
) {

  public static MemberResponse of(Member member, MemberStats memberStats) {
    return new MemberResponse(
        member.getId(),
        member.getNickname(),
        member.getMemberProfileUrl(),
        member.getBlogUrl(),
        member.getGithubUrl(),
        memberStats
    );
  }
}