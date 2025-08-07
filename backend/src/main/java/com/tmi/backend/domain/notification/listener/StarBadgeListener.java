package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.domain.notification.event.PostCreatedEvent;
import com.tmi.backend.domain.notification.event.StarAddedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.star.repository.StarRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class StarBadgeListener {

  private final PostRepository postRepository;
  private final StarRepository starRepository;
  private final MemberBadgeService memberBadgeService;
  private final NotificationService notificationService;

  /**
   * 스타 알림 발생 조건
   * 1. 누적 스타 개수에 따른 뱃지 획득 알림
   */

  Map<Integer, BadgeType> starBadgeMap = Map.of(
      5, BadgeType.STAR_5,
      13, BadgeType.STAR_13,
      42, BadgeType.STAR_42
  );

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(StarAddedEvent e) {

    Integer sum = postRepository.sumStarCountByMemberId(e.postMemberId());
    sum = sum == null ? 0 : sum;

    if (starBadgeMap.containsKey(sum)) {
      BadgeType badge = starBadgeMap.get(sum);
      boolean result = memberBadgeService.acceptedBadge(e.postMemberId(), badge.getId());
      if (!result) {
        return;
      }

      notificationService.broadcast(e.postMemberId(), "뱃지 획득 : " + badge.getName());
    }
  }
}
