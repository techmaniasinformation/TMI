package com.tmi.backend.domain.commentRecommendation.dto.request;

import jakarta.validation.constraints.Positive;

public record RecommendationRequest(
    @Positive Long memberId,
    @Positive Long commentId
) {
}
