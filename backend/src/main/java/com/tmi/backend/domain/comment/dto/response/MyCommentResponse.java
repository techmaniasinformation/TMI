package com.tmi.backend.domain.comment.dto.response;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.member.entity.Member;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record MyCommentResponse(
    Long commentId,
    Long postId,
    String title,
    String memberProfileUrl,
    String name,
    String badgeUrl,
    String comment,
    String link,
    LocalDateTime createAt,
    int recommendCount
) {

  public static MyCommentResponse of(Member member, Comment comment) {
    return MyCommentResponse.builder()
        .commentId(comment.getId())
        .postId(comment.getPost() == null ? null : comment.getPost().getId())
        .title(comment.getPost() == null ? null : comment.getPost().getTitle())
        .memberProfileUrl(member.getMemberProfileUrl())
        .name(member.getNickname())
//        .badgeUrl()
        .comment(comment.getContent())
        .link(comment.getLink())
        .createAt(comment.getCreatedAt())
        .recommendCount(comment.getRecommendCount())
        .build();
  }
}
