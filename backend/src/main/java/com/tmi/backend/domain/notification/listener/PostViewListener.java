package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.notification.event.PostCreatedEvent;
import com.tmi.backend.domain.notification.event.PostViewIncrementedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PostViewListener {

  private final PostRepository postRepository;
  private final NotificationService notificationService;


  /**
   * 게시글 알림 발생 조건
   * 1. 사용자 게시글 누적 조회수에 따른 뱃지 획득 알림
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(PostViewIncrementedEvent e) {

  }
}