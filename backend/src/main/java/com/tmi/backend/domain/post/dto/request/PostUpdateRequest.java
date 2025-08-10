package com.tmi.backend.domain.post.dto.request;

import jakarta.validation.constraints.Size;
import java.util.List;

public record PostUpdateRequest(
    String link,
    String title,
    String thumbnailUrl,
    String content,
    @Size(max = 5) List<String> tags
){
}
