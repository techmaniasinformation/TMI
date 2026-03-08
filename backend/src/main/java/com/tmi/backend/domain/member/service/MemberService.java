package com.tmi.backend.domain.member.service;

import com.tmi.backend.domain.auth.jwt.service.RefreshTokenService;
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
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
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
  private final RefreshTokenService refreshTokenService;
  private final ApplicationEventPublisher publisher;

  public record UpdateMemberResult(Map<String, Long> responseMap, String oldProfileUrlToDelete) {
  }

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
  public ServiceResult<UpdateMemberResult> updateMemberWithUrl(
      Long memberId,
      MemberUpdateRequest req,
      String newProfileUrl,
      boolean isNewFileUpload) {
    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    String currentProfileUrl = member.getMemberProfileUrl();
    String oldProfileUrlToDelete = null;

    // 1. 새로운 썸네일 파일이 업로드 된 경우: 기존 URL 교체 및 삭제 예약
    if (isNewFileUpload) {
      if (currentProfileUrl != null && !currentProfileUrl.isEmpty()) {
        oldProfileUrlToDelete = currentProfileUrl;
      }
    }
    // 2. 파일은 없지만 DTO에서 기존 썸네일을 지워달라고 비워서 요청한 경우
    else {
      String urlFromRequest = req.memberProfileUrl();
      if ((urlFromRequest == null || urlFromRequest.isEmpty())
          && (currentProfileUrl != null && !currentProfileUrl.isEmpty())) {
        oldProfileUrlToDelete = currentProfileUrl;
        newProfileUrl = "default.png"; // DB값 기본 이미지로 복구
      } else {
        // 둘 다 아니면 기존 썸네일 유지
        newProfileUrl = currentProfileUrl;
      }
    }

    member.updateProfile(req.nickname(), newProfileUrl, req.blogUrl(), req.githubUrl());

    return ServiceResult.ok(new UpdateMemberResult(Map.of("memberId", member.getId()), oldProfileUrlToDelete));
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
      // 7일 이내
      throw new BusinessException(ErrorCode.USER_RE_REGISTRATION_FORBIDDEN);

    } else {
      // 7일 이후
      member.reviveAndUpdate(req);
      return member.getId();
    }
  }

  @Transactional
  public ServiceResult<Map<String, Long>> deleteMember(Long memberId) {
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

    // Auth Token 삭제 처리는 MemberController로 위임하여 SRP 준수
    refreshTokenService.deleteByMemberId(memberId);

    return ServiceResult.ok(Map.of("memberId", member.getId()));
  }
}