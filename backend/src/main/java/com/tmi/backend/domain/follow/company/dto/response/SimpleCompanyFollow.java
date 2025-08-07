package com.tmi.backend.domain.follow.company.dto.response;

import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.follow.company.entity.CompanyFollow;

public record SimpleCompanyFollow(Long companyFollowId,
                                  Long companyId,
                                  String name,
                                  String companyProfileUrl
) {

  public static SimpleCompanyFollow from(CompanyFollow cf) {
    Company company = cf.getCompany();
    return new SimpleCompanyFollow(
        cf.getId(),
        company.getId(),
        company.getName(),
        company.getCompanyProfileUrl());
  }
}
