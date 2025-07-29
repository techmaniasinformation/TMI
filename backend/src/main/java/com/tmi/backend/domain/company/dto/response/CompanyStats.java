package com.tmi.backend.domain.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyStats {

  private long postCount;
  private long followerCount;
  private long totalViewCount;

  public static CompanyStats of(long postCount, long followerCount, long totalViewCount) {
    return CompanyStats.builder()
        .postCount(postCount)
        .followerCount(followerCount)
        .totalViewCount(totalViewCount)
        .build();
  }
}