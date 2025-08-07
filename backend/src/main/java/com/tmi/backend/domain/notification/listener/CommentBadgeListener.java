package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentBadgeListener {

  private final CommentRepository commentRepository;
  private final NotificationService notificationService;
}
