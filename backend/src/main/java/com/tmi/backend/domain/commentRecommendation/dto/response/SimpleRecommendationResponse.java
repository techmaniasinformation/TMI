package com.tmi.backend.domain.commentRecommendation.dto.response;

import com.tmi.backend.domain.commentRecommendation.entity.CommentRecommendation;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record SimpleRecommendationResponse(
    Long recommendationId,
    Long commentId
) {

  public static SimpleRecommendationResponse from(CommentRecommendation recommendation) {
    return SimpleRecommendationResponse.builder()
        .recommendationId(recommendation.getId())
        .commentId(recommendation.getComment().getId())
        .build();
  }
}
