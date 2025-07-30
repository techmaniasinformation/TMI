package com.tmi.backend.domain.post.dto.request;

import com.tmi.backend.domain.post.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PostCreateRequest(
  @NotNull Long memberId,
  @NotBlank String link,
  @NotBlank String title,
  String thumbnailUrl,
  String content,
  @Size(max = 5) List<String> tags
) {
}
