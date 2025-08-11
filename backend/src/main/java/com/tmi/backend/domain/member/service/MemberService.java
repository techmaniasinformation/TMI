package com.tmi.backend.domain.member.service;

import com.tmi.backend.domain.auth.jwt.service.RefreshTokenService;
import com.tmi.backend.domain.auth.jwt.service.TokenService;
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
import com.tmi.backend.domain.notification.event.MemberRegisteredEvent;
import com.tmi.backend.domain.notification.repository.NotificationRepository;
import com.tmi.backend.domain.star.repository.StarRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
  private final TokenService tokenService;
  private final RefreshTokenService refreshTokenService;
  private final ApplicationEventPublisher publisher;  // 추가 하기

  public ServiceResult<MemberResponse> getMember(Long memberId) {
    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }
    MemberStats stats = memberRepository.fetchStatsById(memberId);
    return ServiceResult.ok(MemberResponse.of(member, stats));
  }

  public ServiceResult<Map<String, Boolean>> existsByNickname(String nickname) {
    return ServiceResult.ok(Map.of("isDuplicated", memberRepository.existsByNickname(nickname)));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> updateMember(Long memberId, MemberUpdateRequest req) {
    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }
    member.change(req);
    return ServiceResult.ok(Map.of("memberId", member.getId()));
  }

  @Transactional
  public Long createOrReviveMember(MemberCreateRequest req) {

    Member member = memberRepository.findByProviderAndProviderMemberId(req.provider(),
        req.providerMemberId()).orElse(null);

    if (member == null) {
      // 신규 가입
      Member newMember = Member.of(req);
      memberRepository.save(newMember);
      publisher.publishEvent(new MemberRegisteredEvent(newMember.getId())); // 추가 하기
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
  public ServiceResult<Map<String, Long>> deleteMember(Long memberId, HttpServletResponse res) {
    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }
    member.addDeleteAt();
    memberBadgeRepository.deleteByMemberId(memberId);
    memberFollowRepository.deleteByFollowerIdOrFolloweeId(memberId, memberId);
    companyFollowRepository.deleteByFollowerId(memberId);
    starRepository.deleteByMemberId(memberId);
    notificationRepository.deleteAllByMemberId(memberId);
    commentRecommendationRepository.deleteAllByMemberId(memberId);
    tokenService.deleteAuthCookies(res);
    refreshTokenService.deleteByMemberId(memberId);
    return ServiceResult.ok(Map.of("memberId", member.getId()));
  }
}