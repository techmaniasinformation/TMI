package com.tmi.backend.domain.member.service;

import com.tmi.backend.domain.commentRecommendation.respository.CommentRecommendationRepository;
import com.tmi.backend.domain.follow.company.repository.CompanyFollowRepository;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.dto.response.MemberStats;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.memberBadge.repository.MemberBadgeRepository;
import com.tmi.backend.domain.notification.repository.NotificationRepository;
import com.tmi.backend.domain.star.repository.StarRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

  private final MemberRepository memberRepository;
  private final MemberBadgeRepository memberBadgeRepository;
  private final MemberFollowRepository memberFollowRepository;
  private final CompanyFollowRepository companyFollowRepository;
  private final StarRepository starRepository;
  private final NotificationRepository notificationRepository;
  private final CommentRecommendationRepository commentRecommendationRepository;

  public MemberResponse getMember(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    MemberStats stats = memberRepository.fetchStatsById(memberId);

    return MemberResponse.of(member, stats);
  }

  public boolean existsByNickname(String nickname) {
    return memberRepository.existsByNickname(nickname);
  }

  @Transactional
  public Long updateMember(Long memberId, MemberUpdateRequest req) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_INTERNAL_ERROR));

    member.change(req);
    return member.getId();
  }

  @Transactional
  public Long createOrReviveMember(MemberCreateRequest req) {

    Member member = memberRepository.findByProviderAndProviderMemberId(req.provider(),
        req.providerMemberId()).orElse(null);

    if (member == null) {
      // 신규 가입
      Member newMember = Member.of(req);
      memberRepository.save(newMember);
      return newMember.getId();
    }
    // 재가입
    if (member.getDeletedAt() != null && member.getDeletedAt()
        .isAfter(LocalDateTime.now(ZoneOffset.UTC).minusDays(7))) {
      //7일 이내
      throw new BusinessException(ErrorCode.USER_RE_REGISTRATION_FORBIDDEN);

    } else {
      //7일 이후
      member.reviveAndUpdate(req);
      return member.getId();

    }

  }

  @Transactional
  public Long deleteMember(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    member.delete();

    memberBadgeRepository.deleteAllByMemberId(memberId);
    memberFollowRepository.deleteAllByFollowerOrFollowee(memberId);
    companyFollowRepository.deleteAllByFollowerId(memberId);
    starRepository.deleteAllByMemberId(memberId);
    notificationRepository.deleteAllByMemberId(memberId);
    commentRecommendationRepository.deleteAllByMemberId(memberId);
    return member.getId();
  }
}