package com.tmi.backend.global.common.entity;

import java.util.List;

public record AppliedFilters(String q, List<String> techTags, List<String> companyTags) {

  public static AppliedFilters of(String q, List<String> techTags, List<String> companyTags) {

    return new AppliedFilters(
        q,
        techTags == null ? List.of() : techTags,
        companyTags == null ? List.of() : companyTags
    );
  }
}
