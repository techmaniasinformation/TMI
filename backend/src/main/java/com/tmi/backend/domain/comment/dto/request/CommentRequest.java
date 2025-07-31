package com.tmi.backend.domain.comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentRequest(
    @NotNull Long memberId,
    @NotNull Long postId,
    @NotBlank String comment,
    String link
) {
}
