package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.commentRecommendation.respository.CommentRecommendationRepository;
import com.tmi.backend.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentRecommendBadgeListener {

  private final CommentRecommendationRepository commentRecommendationRepository;
  private final NotificationService notificationService;
}
