package com.tmi.backend.domain.member.dto.response;


import com.tmi.backend.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberResponse {

  private Long memberId;
  private String nickname;
  private String memberProfileUrl;
  private String blogUrl;
  private String githubUrl;
  private MemberStats stats;

  public static MemberResponse of(Member member, MemberStats stats) {
    return MemberResponse.builder()
        .memberId(member.getMemberId())
        .nickname(member.getNickname())
        .memberProfileUrl(member.getMemberProfileUrl())
        .blogUrl(member.getBlogUrl())
        .githubUrl(member.getGithubUrl())
        .stats(stats)
        .build();
  }
}