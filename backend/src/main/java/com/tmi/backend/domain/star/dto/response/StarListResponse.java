package com.tmi.backend.domain.star.dto.response;

import com.tmi.backend.domain.star.entity.Star;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record StarListResponse(
    List<SimpleStarResponse> stars
) {

  public static StarListResponse from(List<Star> starList) {
    List<SimpleStarResponse> stars = new ArrayList<>();

    for (Star star : starList) {
      stars.add(SimpleStarResponse.from(star));
    }

    return StarListResponse.builder()
        .stars(stars)
        .build();
  }
}
