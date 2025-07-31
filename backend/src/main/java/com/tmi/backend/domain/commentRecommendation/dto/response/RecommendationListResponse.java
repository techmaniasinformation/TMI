package com.tmi.backend.domain.commentRecommendation.dto.response;

import com.tmi.backend.domain.commentRecommendation.entity.CommentRecommendation;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record RecommendationListResponse(
    List<SimpleRecommendationResponse> recommendations
) {

  public static RecommendationListResponse from(List<CommentRecommendation> list) {
    // null 안전 처리
    List<CommentRecommendation> src = list == null ? Collections.emptyList() : list;

    return RecommendationListResponse.builder()
        .recommendations(
            src.stream()
                .map(SimpleRecommendationResponse::from)
                .collect(Collectors.toList())
        )
        .build();
  }
}
