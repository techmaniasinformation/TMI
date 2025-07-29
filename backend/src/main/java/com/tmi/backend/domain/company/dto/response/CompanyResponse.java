package com.tmi.backend.domain.company.dto.response;

import com.tmi.backend.domain.company.entity.Company;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {

  private Long companyId;
  private String name;
  private String companyProfileUrl;
  private String techBlogUrl;
  private LocalDateTime lastUpdatedAt;
  private CompanyStats stats;

  public static CompanyResponse of(Company company, LocalDateTime lastUpdateAt,
      CompanyStats stats) {
    return CompanyResponse.builder()
        .companyId(company.getCompanyId())
        .name(company.getName())
        .companyProfileUrl(company.getCompanyProfileUrl())
        .techBlogUrl(company.getTechBlogUrl())
        .lastUpdatedAt(lastUpdateAt)
        .stats(stats)
        .build();
  }
}

