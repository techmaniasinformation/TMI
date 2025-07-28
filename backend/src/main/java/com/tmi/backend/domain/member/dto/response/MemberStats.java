package com.tmi.backend.domain.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberStats {

  private long postCount;
  private long commentCount;
  private long followerCount;
  private long totalViewCount;

  public static MemberStats of(long postCount, long commentCount, long followerCount,
      long totalViewCount) {
    return MemberStats.builder()
        .postCount(postCount)
        .commentCount(commentCount)
        .followerCount(followerCount)
        .totalViewCount(totalViewCount)
        .build();
  }
}