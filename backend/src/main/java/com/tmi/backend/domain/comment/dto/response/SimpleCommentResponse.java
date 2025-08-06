package com.tmi.backend.domain.comment.dto.response;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.member.entity.Member;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record SimpleCommentResponse(
    Long commentId,
    String memberProfileUrl,
    String name,
    String badgeUrl,
    String comment,
    String link,
    LocalDateTime createAt,
    int recommendCount
) {

  public static SimpleCommentResponse of(Member member, Comment comment) {
    return SimpleCommentResponse.builder()
        .commentId(comment.getId())
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
