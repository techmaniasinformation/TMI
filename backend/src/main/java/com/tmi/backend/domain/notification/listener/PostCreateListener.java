package com.tmi.backend.domain.notification.listener;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.follow.company.entity.CompanyFollow;
import com.tmi.backend.domain.follow.company.repository.CompanyFollowRepository;
import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.domain.notification.event.PostCreatedEvent;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.domain.post.repository.PostRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class PostCreateListener {

  private final PostRepository postRepository;
  private final MemberFollowRepository memberFollowRepository;
  private final CompanyFollowRepository companyFollowRepository;
  private final MemberBadgeService memberBadgeService;
  private final NotificationService notificationService;

  /**
   * 게시글 알림 발생 조건
   * 1. 첫 게시글 등록
   * 2. 내가 팔로우한 기업/사용자 게시글 작성시
   */

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void on(PostCreatedEvent e) {

    if(1 == postRepository.countByMemberId(e.postMemberId())) {
      // 뱃지 획득 알림 발송
      boolean result = memberBadgeService.acceptedBadge(e.postMemberId(),
          BadgeType.FIRST_ARTICLE.getId());
      if (!result) {
        return;
      }

      notificationService.broadcast(e.postMemberId(), "뱃지 획득 : " + BadgeType.FIRST_ARTICLE.getName());
    }

    List<MemberFollow> memberFollows = memberFollowRepository.findByFolloweeId(e.postMemberId());
    for (MemberFollow follow : memberFollows) {
      notificationService.broadcast(follow.getFollower().getId(),
          follow.getFollowee().getNickname() + " 님이 게시글 등록");
    }

    List<CompanyFollow> companyFollows = companyFollowRepository.findByCompanyId(e.postCompanyId());
    for (CompanyFollow follow : companyFollows) {
      notificationService.broadcast(follow.getFollower().getId(),
          follow.getCompany().getName() + " 님이 게시글 등록");
    }
  }
}
