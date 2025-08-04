package com.tmi.backend.domain.post.dto.response;

import com.tmi.backend.global.common.entity.AppliedFilters;
import com.tmi.backend.global.common.entity.PageDetail;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record SimplePostSearchResponse(
    List<SimplePostResponse> posts,
    PageDetail pageInfo,
    AppliedFilters appliedFilters
) {

}
