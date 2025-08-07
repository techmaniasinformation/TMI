package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.star.repository.StarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StarBadgeListener {

  private final StarRepository starRepository;
  private final NotificationService notificationService;
}
