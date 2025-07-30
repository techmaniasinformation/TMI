package com.tmi.backend.domain.star.dto.request;

import jakarta.validation.constraints.Positive;

public record StarRegisterRequest(
    @Positive Long memberId,
    @Positive Long postId
) {
}
