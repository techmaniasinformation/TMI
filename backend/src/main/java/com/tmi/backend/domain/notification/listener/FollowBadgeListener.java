package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.domain.notification.event.CommentCreatedEvent;
import com.tmi.backend.domain.notification.event.FollowAddedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class FollowBadgeListener {

  private final MemberFollowRepository memberFollowRepository;
  private final MemberBadgeService memberBadgeService;
  private final NotificationService notificationService;

  /**
   * 팔로우 알림 발생 조건
   * 1. 팔로워 수에 따른 뱃지 획득 알림
   */

  Map<Integer, BadgeType> followBadgeMap = Map.of(
      1, BadgeType.AMUMU,
      10, BadgeType.FC_TMI,
      100, BadgeType.EXPLOSION
  );

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(FollowAddedEvent e) {

    int count = memberFollowRepository.countByFolloweeId(e.followeeId());

    if (followBadgeMap.containsKey(count)) {
      BadgeType badge = followBadgeMap.get(count);
      boolean result = memberBadgeService.acceptedBadge(e.followeeId(), badge.getId());
      if (!result) {
        return;
      }
      notificationService.broadcast(e.followeeId(), "뱃지 획득 : " + badge.getName());
    }
  }
}
