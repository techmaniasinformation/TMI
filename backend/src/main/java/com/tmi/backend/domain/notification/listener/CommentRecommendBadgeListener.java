package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.commentRecommendation.respository.CommentRecommendationRepository;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.domain.notification.event.CommentCreatedEvent;
import com.tmi.backend.domain.notification.event.RecommendationAddedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class CommentRecommendBadgeListener {

  private final CommentRecommendationRepository commentRecommendationRepository;
  private final CommentRepository commentRepository;
  private final MemberBadgeService memberBadgeService;
  private final NotificationService notificationService;

  /**
   * 추천 알림 발생 조건
   * 1. 누적 추천수에 따른 뱃지 획득 알림
   */

  Map<Integer, BadgeType> recommendBadgeMap = Map.of(
      10, BadgeType.LIKE_10,
      100, BadgeType.LIKE_100,
      1000, BadgeType.LIKE_1000
  );

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(RecommendationAddedEvent e) {

    Integer sum = commentRepository.sumRecommendCountByMemberId(e.CommentMemberId());
    sum = sum == null ? 0 : sum;

    if (recommendBadgeMap.containsKey(sum)) {
      BadgeType badge = recommendBadgeMap.get(sum);
      boolean result = memberBadgeService.acceptedBadge(e.CommentMemberId(), badge.getId());
      if (!result) {
        return;
      }

      notificationService.broadcast(e.CommentMemberId(), "뱃지 획득 : " + badge.getName());
    }
  }
}
