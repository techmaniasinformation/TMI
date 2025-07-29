package com.tmi.backend.domain.company.dto.response;

import com.tmi.backend.domain.company.entity.Company;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public record CompanyResponse(
    Long companyId,
    String name,
    String companyProfileUrl,
    String techBlogUrl,
    LocalDateTime lastUpdatedAt,
    CompanyStats stats
) {

  public static CompanyResponse of(Company company, LocalDateTime lastUpdatedAt, CompanyStats stats) {
    return new CompanyResponse(
        company.getId(),
        company.getName(),
        company.getCompanyProfileUrl(),
        company.getTechBlogUrl(),
        lastUpdatedAt,
        stats
    );
  }
}
