package com.tmi.backend.domain.company.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CompanyCreateRequest {

  @NotBlank
  private String name;
  
  private String companyProfileUrl;

  private String techBlogUrl;
}
