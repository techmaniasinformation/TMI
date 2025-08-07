package com.tmi.backend.domain.summary.dto.response;

import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record SummaryResponse(String summary, List<String> tags) {

  public static SummaryResponse of(String summary, List<String> tags) {
    return SummaryResponse.builder().summary(summary).tags(tags).build();
  }
}
