package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TagBadgeListener {

  private final TagRepository tagRepository;
  private final NotificationService notificationService;
}
