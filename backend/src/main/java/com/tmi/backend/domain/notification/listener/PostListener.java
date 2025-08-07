package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.follow.company.repository.CompanyFollowRepository;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.notification.event.CommentCreatedEvent;
import com.tmi.backend.domain.notification.event.PostEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PostListener {

  private final PostRepository postRepository;
  private final MemberFollowRepository memberFollowRepository;
  private final CompanyFollowRepository companyFollowRepository;
  private final NotificationService notificationService;

  /**
   * 게시글 알림 발생 조건
   * 1. 첫 게시글 등록
   * 2. 사용자 게시글 누적 조회수에 따른 뱃지 획득 알림
   * 3. 내가 팔로우한 기업/사용자 게시글 작성시
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(PostEvent e) {

//    postRepository.existsByMemberId(e.postMemberId());

  }

}
