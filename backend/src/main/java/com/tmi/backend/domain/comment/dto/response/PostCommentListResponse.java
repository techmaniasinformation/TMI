package com.tmi.backend.domain.comment.dto.response;

import com.tmi.backend.domain.comment.entity.Comment;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record PostCommentListResponse(
    Long bestCommentId,
    List<SimpleCommentResponse> comments
) {

  public static PostCommentListResponse of(Comment best, List<Comment> commentList) {
    List<SimpleCommentResponse> comments = commentList
        .stream()
        .map(c -> SimpleCommentResponse.of(c.getMember(), c))
        .toList();

    return PostCommentListResponse.builder()
        .bestCommentId(best == null ? -1 : best.getId())
        .comments(comments)
        .build();
  }
}
