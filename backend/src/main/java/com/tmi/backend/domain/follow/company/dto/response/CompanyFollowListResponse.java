package com.tmi.backend.domain.follow.company.dto.response;

import com.tmi.backend.domain.follow.company.entity.CompanyFollow;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import org.springframework.data.domain.Page;

public record CompanyFollowListResponse(
    List<SimpleCompanyFollow> companyFollows,
    PageDetail pageInfo
) {

  public static CompanyFollowListResponse from(
      Page<CompanyFollow> page
  ) {
    List<SimpleCompanyFollow> dtos = page.getContent().stream()
        .map(SimpleCompanyFollow::from)
        .toList();

    PageDetail pageDetail = new PageDetail(
        page.getTotalElements(),
        page.getTotalPages(),
        page.isLast(),
        page.getNumber()
    );

    return new CompanyFollowListResponse(dtos, pageDetail);
  }
}
