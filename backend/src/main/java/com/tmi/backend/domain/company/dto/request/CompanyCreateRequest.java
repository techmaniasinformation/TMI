package com.tmi.backend.domain.company.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CompanyCreateRequest(
    @NotBlank String name,
    String companyProfileUrl,
    String techBlogUrl) {
}
