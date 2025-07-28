package com.tmi.backend.domain.post.dto.request;

import com.tmi.backend.domain.post.entity.Post;
import java.util.List;

public record PostCreateRequest(
  String link,
  String title,
  String thumbnailUrl,
  String content,
  List<String> tags
) {
}
