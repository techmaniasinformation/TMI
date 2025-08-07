package com.tmi.backend.domain.comment.dto.response;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder(access = AccessLevel.PRIVATE)
public record MyCommentListResponse(
    List<MyCommentResponse> comments,
    PageDetail pageInfo
) {

  public static MyCommentListResponse of (Page<Comment> commentPage, int page) {
    List<MyCommentResponse> comments = commentPage.getContent()
        .stream()
        .map(c -> MyCommentResponse.of(c.getMember(), c))
        .toList();

    PageDetail pageInfo = PageDetail.of(
        commentPage.getTotalElements(),
        commentPage.getTotalPages(),
        commentPage.isLast(),
        page
    );

    return MyCommentListResponse.builder()
        .comments(comments)
        .pageInfo(pageInfo)
        .build();
  }
}
