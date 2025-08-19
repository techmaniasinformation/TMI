package com.tmi.backend.domain.post.dto.response;

import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder(access = AccessLevel.PRIVATE)
public record SimplePostPageResponse(
    List<SimplePostResponse> posts,
    PageDetail pageInfo
) {

  public static SimplePostPageResponse of(
      Page<Post> postPage,
      int page,
      Map<Long, Integer> countMap,
      Map<Long, String> badgeUrlMap
  ) {

    List<SimplePostResponse> posts = postPage.getContent().stream()
        .map(p -> {
          Long mid = p.getMember() == null ? null : p.getMember().getId();
          String badge = (mid == null || mid == 1L) ? "" : badgeUrlMap.getOrDefault(mid, "");
          return SimplePostResponse.of(p, countMap.getOrDefault(p.getId(), 0), badge);
        })
        .toList();

    PageDetail pageInfo = PageDetail.of(
        postPage.getTotalElements(),
        postPage.getTotalPages(),
        postPage.isLast(),
        page
    );

    return SimplePostPageResponse.builder()
        .posts(posts)
        .pageInfo(pageInfo)
        .build();
  }
}
