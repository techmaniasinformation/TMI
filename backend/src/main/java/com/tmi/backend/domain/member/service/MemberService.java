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
import com.tmi.backend.domain.notification.event.MemberRegisteredEvent;
import com.tmi.backend.domain.notification.repository.NotificationRepository;
import com.tmi.backend.domain.star.repository.StarRepository;
import com.tmi.backend.global.Utils.FileUtil;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

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
  private final ApplicationEventPublisher publisher;

  private final FileUtil fileUtil;

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
  public ServiceResult<Map<String, Long>> updateMember(Long memberId, MemberUpdateRequest req,
      MultipartFile profileImage) {
    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    String newProfileUrl = member.getMemberProfileUrl();

    // 새로운 이미지 파일이 업로드된 경우
    if (profileImage != null && !profileImage.isEmpty()) {
      if (newProfileUrl != null && !newProfileUrl.isEmpty()) {
        try {
          fileUtil.deleteFile(newProfileUrl, "profile");
        } catch (IOException e) {
          log.error("기존 프로필 이미지 삭제 실패: {}", newProfileUrl, e);
        }
      }

      // 새 파일 저장 및 롤백 처리
      try {
        newProfileUrl = fileUtil.saveFile(profileImage, "profile");
        // 2. 트랜잭션 롤백 시 파일 삭제를 위한 동기화 작업 등록
        final String finalNewProfileUrl = newProfileUrl; // 람다에서 사용하기 위해 final 변수로
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
          @Override
          public void afterCompletion(int status) {
            if (status == STATUS_ROLLED_BACK) {
              try {
                fileUtil.deleteFile(finalNewProfileUrl, "profile");
              } catch (IOException e) {
                log.error("프로필 이미지 롤백 중 파일 삭제 실패", e);
              }
            }
          }
        });
      } catch (IOException e) {
        return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR);
      }
    }

    // 이미지 삭제
    else {
      String urlFromRequest = req.memberProfileUrl();
      if ((urlFromRequest == null || urlFromRequest.isEmpty()) && (newProfileUrl != null
          && !newProfileUrl.isEmpty())) {
        try {
          fileUtil.deleteFile(newProfileUrl, "profile");
          newProfileUrl = "default.png"; // DB에 저장할 URL도 null로 변경
        } catch (IOException e) {
          log.error("프로필 이미지 삭제 실패: {}", newProfileUrl, e);
        }
      }
    }

    member.updateProfile(req.nickname(), newProfileUrl, req.blogUrl(), req.githubUrl());

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
      publisher.publishEvent(new MemberRegisteredEvent(newMember.getId()));
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

    memberBadgeRepository.deleteByMemberId(memberId);
    memberFollowRepository.deleteByFollowerIdOrFolloweeId(memberId, memberId);
    companyFollowRepository.deleteByFollowerId(memberId);
    starRepository.deleteByMemberId(memberId);
    notificationRepository.deleteAllByMemberId(memberId);
    commentRecommendationRepository.deleteAllByMemberId(memberId);
    return member.getId();
  }
}