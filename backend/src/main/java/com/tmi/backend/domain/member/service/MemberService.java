package com.tmi.backend.domain.member.service;

import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.dto.response.MemberStats;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

  private final MemberRepository memberRepository;
//  private final MemberBadgeRepository memberBadgeRepository;
//  private final MemberFollowRepository memberFollowRepository;
//  private final CompanyFollowRepository companyFollowRepository;
//  private final StarRepository starRepository;
//  private final NotificationRepository notificationRepository;
//  private final CommentRecommendationRepository commentRecommendationRepository;

  public MemberResponse getMember(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    MemberStats stats = memberRepository.fetchStatsById(memberId); // 하드코딩된 값 예시

    return MemberResponse.of(member, stats);
  }

  public boolean existsByNickname(String nickname) {
    return memberRepository.existsByNickname(nickname);
  }

  @Transactional
  public void updateMember(Long memberId, MemberUpdateRequest req) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_INTERNAL_ERROR));

    member.setNickname(req.nickname());
    member.setMemberProfileUrl(req.memberProfileUrl());
    member.setBlogUrl(req.blogUrl());
    member.setGithubUrl(req.githubUrl());
  }

  @Transactional
  public Long createOrReviveMember(MemberCreateRequest req) {

    Member member = memberRepository.findByProviderAndProviderMemberId(
        req.provider(), req.providerMemberId()
    ).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    // 이미 탈퇴된 회원 → 정보 갱신 후 복구
    if (member.getDeletedAt() != null) {
      member.reviveAndUpdate(); //시간 업데이트
      member.setNickname(req.nickname());
      member.setMemberProfileUrl(req.memberProfileUrl());
      return member.getId();
    }

    // 신규 가입
    Member newMember = Member.of(
        req.provider(),
        req.providerMemberId(),
        req.nickname(),
        req.memberProfileUrl()
    );
    memberRepository.save(newMember);
    return newMember.getId();
  }

  @Transactional
  public Long resign(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    member.delete();

    //TODO : 멤버뱃지, 멤버팔로우, 회사팔로우,스타, 댓글추천, 알림의 관련 행 삭제 구현하기.

    return member.getId();
  }
}