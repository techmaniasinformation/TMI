package com.tmi.backend.domain.star.dto.response;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.star.entity.Star;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record SimpleStarResponse(
    Long starId,
    Long postId
) {

  public static SimpleStarResponse from(Star star) {
    return SimpleStarResponse.builder()
        .starId(star.getId())
        .postId(star.getPost().getId())
        .build();
  }
}
