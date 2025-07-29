package com.tmi.backend.domain.member.dto.response;

public record MemberStats(

    long postCount,
    long commentCount,
    long followerCount,
    long totalViewCount
) {

  public static MemberStats of(long postCount, long commentCount, long followerCount,
      long totalViewCount) {
    return new MemberStats(postCount, commentCount, followerCount, totalViewCount);
  }
}