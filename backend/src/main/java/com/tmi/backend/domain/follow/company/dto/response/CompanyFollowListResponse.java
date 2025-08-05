package com.tmi.backend.domain.follow.company.dto.response;

import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;

public record CompanyFollowListResponse(
    List<SimpleCompanyFollow> CompanyFollows,
    PageDetail pageInfo
) {

  public static CompanyFollowListResponse of(
      List<SimpleCompanyFollow> companyFollows,
      PageDetail pageInfo) {
    return new CompanyFollowListResponse(
        companyFollows, pageInfo);
  }
}