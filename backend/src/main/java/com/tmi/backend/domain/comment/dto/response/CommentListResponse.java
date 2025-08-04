package com.tmi.backend.domain.comment.dto.response;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder(access = AccessLevel.PRIVATE)
public record CommentListResponse(
    List<SimpleCommentResponse> comments,
    PageDetail pageInfo
) {

  public static CommentListResponse of (Page<Comment> commentPage, int page) {
    List<SimpleCommentResponse> comments = commentPage.getContent()
        .stream()
        .map(c -> SimpleCommentResponse.of(c.getMember(), c))
        .toList();

    PageDetail pageInfo = PageDetail.of(
        commentPage.getTotalElements(),
        commentPage.getTotalPages(),
        commentPage.isLast(),
        page
    );

    return CommentListResponse.builder()
        .comments(comments)
        .pageInfo(pageInfo)
        .build();
  }
}
