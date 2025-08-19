package com.tmi.backend.domain.post.dto.request;

import jakarta.validation.constraints.AssertTrue;
import java.util.Objects;
import java.util.stream.Stream;

public record PostFilter(
    Long followMemberId,
    Long companyId,
    Long memberId,
    Long starMemberId
) {

  @AssertTrue(message = "필터는 최대 하나만 설정할 수 있습니다.")
  public boolean isSingleOrNone() {
    return Stream.of(followMemberId, companyId, memberId, starMemberId)
        .filter(Objects::nonNull)
        .count() <= 1;
  }

  public long countNonNull() {
    return Stream.of(followMemberId, companyId, memberId, starMemberId)
        .filter(Objects::nonNull).count();
  }}
