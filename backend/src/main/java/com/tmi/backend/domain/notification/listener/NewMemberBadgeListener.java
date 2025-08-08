package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.domain.notification.dto.request.NotificationCreateRequest;
import com.tmi.backend.domain.notification.entity.NotificationType;
import com.tmi.backend.domain.notification.event.MemberRegisteredEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NewMemberBadgeListener {

  private final TagRepository tagRepository;
  private final MemberBadgeService memberBadgeService;
  private final NotificationService notificationService;

  /**
   * 회원 가입시 뱃지 획득 알림
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(MemberRegisteredEvent e) {

    memberBadgeService.acceptedBadge(e.memberId(), BadgeType.HELLO_WORLD.getId());
    memberBadgeService.acceptedBadge(e.memberId(), BadgeType.NONE.getId());

    notificationService.createNotification(
        NotificationCreateRequest.of(e.memberId(), null, BadgeType.HELLO_WORLD, NotificationType.BADGE_ACQUIRED));
  }
}
