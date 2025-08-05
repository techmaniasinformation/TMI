package com.tmi.backend.domain.member.dto.response;

public record MemberStats(

    long postCount,
    long commentCount,
    long followerCount,
    long totalViewCount
) {
  
}