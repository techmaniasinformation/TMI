package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.commentRecommendation.respository.CommentRecommendationRepository;
import com.tmi.backend.domain.notification.event.CommentCreatedEvent;
import com.tmi.backend.domain.notification.event.RecommendationAddedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class CommentRecommendBadgeListener {

  private final CommentRecommendationRepository commentRecommendationRepository;
  private final CommentRepository commentRepository;
  private final NotificationService notificationService;

  /**
   * 추천 알림 발생 조건
   * 1. 누적 추천수에 따른 뱃지 획득 알림
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(RecommendationAddedEvent e) {

//    List<Comment> comments = commentRepository.findAllByMemberId(e.CommentMemberId());
//    long sum = 0;
//    for (Comment comment : comments) {
//      sum += comment.getRecommendCount();
//    }
//
//    if (sum != 0 && sum % 10 == 0) {
//      // 추천 갯수 뱃지 획득
//    }

  }
}
