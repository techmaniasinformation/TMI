package com.tmi.backend.domain.member.dto.response;

import com.tmi.backend.domain.member.entity.Member;

public record MemberResponse(
    Long memberId,
    String nickname,
    String memberProfileUrl,
    String blogUrl,
    String githubUrl,
    MemberStats stats) {

  public static MemberResponse of(Member member, MemberStats stats) {
    return new MemberResponse(member.getId(), member.getNickname(), member.getMemberProfileUrl(),
        member.getBlogUrl(), member.getGithubUrl(), stats);
  }
}