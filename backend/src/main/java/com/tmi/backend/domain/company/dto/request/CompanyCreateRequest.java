package com.tmi.backend.domain.company.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CompanyCreateRequest {

  @NotBlank
  private String name;

  private String description; // 현재는 사용되지 않지만, 구조에 포함되어 있음

  private String companyProfileUrl;

  private String techBlogUrl;
}
