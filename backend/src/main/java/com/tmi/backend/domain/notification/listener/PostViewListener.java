package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.domain.notification.dto.request.NotificationCreateRequest;
import com.tmi.backend.domain.notification.entity.NotificationType;
import com.tmi.backend.domain.notification.event.PostViewIncrementedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PostViewListener {

  private final PostRepository postRepository;
  private final MemberBadgeService memberBadgeService;
  private final NotificationService notificationService;


  /**
   * 게시글 알림 발생 조건
   * 1. 사용자 게시글 누적 조회수에 따른 뱃지 획득 알림
   */

  Map<Integer, BadgeType> viewCountBadgeMap = Map.of(
      50, BadgeType.VIEW_50,
      100, BadgeType.VIEW_100,
      1000, BadgeType.VIEW_1000
  );

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(PostViewIncrementedEvent e) {

    Integer sum = postRepository.sumViewCountByMemberId(e.postMemberId());
    sum = sum == null ? 0 : sum;

    if (viewCountBadgeMap.containsKey(sum)) {
      BadgeType badge = viewCountBadgeMap.get(sum);
      boolean result = memberBadgeService.acceptedBadge(e.postMemberId(), badge.getId());
      if (!result) {
        return;
      }

      notificationService.createNotification(
          NotificationCreateRequest.of(e.postMemberId(), null, badge, NotificationType.BADGE_ACQUIRED));
    }
  }
}