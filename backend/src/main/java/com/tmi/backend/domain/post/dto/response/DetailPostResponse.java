package com.tmi.backend.domain.post.dto.response;

import com.tmi.backend.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record DetailPostResponse(
    Long postId,
    Long memberId,
    Long companyId,
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

  public static DetailPostResponse of(Post post, int commentCount) {
    String memberName = (post.getMember().getId() == 1 && !Objects.isNull(post.getCompany())) ? post.getCompany().getName() :post.getMember().getNickname();
    String profile = (post.getMember().getId() == 1 && !Objects.isNull(post.getCompany())) ? post.getCompany().getCompanyProfileUrl() : post.getMember().getMemberProfileUrl();
    profile = Objects.isNull(profile) ? "" : profile;


    return DetailPostResponse.builder()
        .postId(post.getId())
        .memberId(post.getMember() == null ? null : post.getMember().getId())
        .companyId(post.getCompany() == null ? null : post.getCompany().getId())
        .title(post.getTitle())
        .tags(post.getPostTags().stream()
            .map(pt -> pt.getTag().getName())
            .toList())
        .memberProfileUrl(profile)
        .companyProfileUrl(profile)
        .name(memberName)
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
