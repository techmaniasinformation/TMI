package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostBadgeListener {

  private final PostRepository postRepository;
  private final NotificationService notificationService;
}
