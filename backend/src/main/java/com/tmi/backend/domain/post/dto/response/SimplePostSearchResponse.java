package com.tmi.backend.domain.post.dto.response;

import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.global.common.entity.AppliedFilters;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder(access = AccessLevel.PRIVATE)
public record SimplePostSearchResponse(
    List<SimplePostResponse> posts,
    PageDetail pageInfo,
    AppliedFilters appliedFilters
) {

  public static SimplePostSearchResponse of(Page<Post> page,
      int reqPage,
      Map<Long,Integer> countMap,
      AppliedFilters applied) {

    List<SimplePostResponse> posts = page.getContent().stream()
        .map(p -> SimplePostResponse.of(
            p,
            countMap.getOrDefault(p.getId(), 0)))
        .toList();

    PageDetail pd = PageDetail.of(
        page.getTotalElements(),
        page.getTotalPages(),
        page.isLast(),
        reqPage);

    return SimplePostSearchResponse.builder()
        .posts(posts)
        .pageInfo(pd)
        .appliedFilters(applied)
        .build();
  }
}
