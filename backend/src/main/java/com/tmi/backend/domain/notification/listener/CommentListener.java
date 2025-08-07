package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.notification.event.CommentCreatedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class CommentListener {

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final MemberFollowRepository memberFollowRepository;
  private final NotificationService notificationService;

  /**
   * 댓글 알림 발생 조건
   * 1. 게시글 저자에게 알림
   * 2. 첫 댓글 작성시 뱃지 획득 알림
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(CommentCreatedEvent e) {

//    if(commentRepository.existsByMemberId(e.commentMemberId())) {
//      // 뱃지 획득 알림 발송
//    }

    // 게시글 저자에게 알림 발생

  }

}
