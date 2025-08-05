package com.tmi.backend.domain.follow.member.dto.request;

import jakarta.validation.constraints.NotNull;

public record MemberFollowCreateRequest(
    @NotNull Long followerId,
    @NotNull Long followeeId
) {

}