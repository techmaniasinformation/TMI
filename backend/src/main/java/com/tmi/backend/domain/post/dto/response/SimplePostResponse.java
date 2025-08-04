package com.tmi.backend.domain.post.dto.response;

import com.tmi.backend.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record SimplePostResponse(
    String postId,
    String memberProfile,
    String companyProfileUrl,
    String name,
    String badgeUrl,
    String title,
    LocalDateTime createAt,
    int viewCount,
    int starCount,
    int commentCount,
    List<String> tags,
    String thumbnailUrl
) {

  public static SimplePostResponse of(Post post, int commentCount) {
    return SimplePostResponse.builder()
        .postId(post.getId().toString())
        .memberProfile(post.getMember().getMemberProfileUrl())
        .companyProfileUrl(post.getCompany().getCompanyProfileUrl())
        .name(post.getMember().getNickname())
//        .badgeUrl(post.getMember().getBadgeUrl())
        .title(post.getTitle())
        .createAt(post.getCreatedAt())
        .viewCount(post.getViewCount())
        .starCount(post.getStarCount())
        .commentCount(commentCount)
        .tags(post.getPostTags().stream()
                .map(pt -> pt.getTag().getName())
                .toList())
        .thumbnailUrl(post.getThumbnailUrl())
        .build();
  }
}
