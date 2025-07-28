package com.tmi.backend.domain.post.dto.request;

import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
public class PostUpdateRequest {
  private String link;
  private String title;
  private String thumbnailUrl;
  private String content;
  @Size(max = 5) private List<String> tags;
}
