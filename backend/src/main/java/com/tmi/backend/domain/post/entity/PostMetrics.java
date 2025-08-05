package com.tmi.backend.domain.post.entity;

import java.time.LocalDateTime;

public interface PostMetrics {
  Long getPostId();
  int  getViewCount();
  int  getStarCount();
  LocalDateTime getCreatedAt();
}
