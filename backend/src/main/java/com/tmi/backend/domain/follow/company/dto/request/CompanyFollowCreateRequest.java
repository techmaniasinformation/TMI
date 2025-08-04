package com.tmi.backend.domain.follow.company.dto.request;

import jakarta.validation.constraints.NotNull;

public record CompanyFollowCreateRequest(
    @NotNull Long followerId,
    @NotNull Long companyId
) {

}