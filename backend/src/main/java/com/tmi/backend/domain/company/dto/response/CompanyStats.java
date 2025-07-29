package com.tmi.backend.domain.company.dto.response;

public record CompanyStats(

    long postCount,
    long followerCount,
    long totalViewCount
) {

  public static CompanyStats of(long postCount, long followerCount, long totalViewCount) {
    return new CompanyStats(postCount, followerCount, totalViewCount);
  }
}