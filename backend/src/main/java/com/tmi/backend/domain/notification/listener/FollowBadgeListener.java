package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.notification.event.CommentCreatedEvent;
import com.tmi.backend.domain.notification.event.FollowAddedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class FollowBadgeListener {

  private final MemberFollowRepository memberFollowRepository;
  private final NotificationService notificationService;

  /**
   * 팔로우 알림 발생 조건
   * 1. 팔로워 수에 따른 뱃지 획득 알림
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(FollowAddedEvent e) {

//    long count = memberFollowRepository.countByFollweeId(e.followeeId());
//
//    if (count == 1) {
//    }
//
//    if (count == 10) {
//    }
//
//    if (count == 100) {
//    }
  }
}
