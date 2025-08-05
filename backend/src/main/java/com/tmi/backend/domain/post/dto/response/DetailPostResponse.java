package com.tmi.backend.domain.post.dto.response;

import com.tmi.backend.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record DetailPostResponse(
    Long postId,
    String title,
    List<String> tags,
    String memberProfileUrl,
    String companyProfileUrl,
    String name,
    String badgeUrl,
    LocalDateTime createAt,
    int viewCount,
    int starCount,
    int commentCount,
    String thumbnailUrl,
    String content,
    String link
) {

  public static DetailPostResponse of(Post post,
      int commentCount) {

    return DetailPostResponse.builder()
        .postId(post.getId())
        .title(post.getTitle())
        .tags(post.getPostTags().stream()
            .map(pt -> pt.getTag().getName())
            .toList())
        .memberProfileUrl(post.getMember().getMemberProfileUrl())
        .companyProfileUrl(post.getCompany() != null
            ? post.getCompany().getCompanyProfileUrl()
            : null)
        .name(post.getMember().getNickname())
        // .badgeUrl(post.getMember().getBadgeUrl())
        .badgeUrl(null)                               // 예시: 아직 미구현
        .createAt(post.getCreatedAt())
        .viewCount(post.getViewCount())
        .starCount(post.getStarCount())
        .commentCount(commentCount)
        .thumbnailUrl(post.getThumbnailUrl())
        .content(post.getContent())
        .link(post.getLink())
        .build();
  }
}
