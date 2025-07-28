package com.tmi.backend.domain.member.service;


import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.dto.response.MemberStats;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

  private final MemberRepository memberRepository;
//  private final MemberBadgeRepository memberBadgeRepository;
//  private final MemberFollowRepository memberFollowRepository;
//  private final CompanyFollowRepository companyFollowRepository;
//  private final StarRepository starRepository;
//  private final NotificationRepository notificationRepository;
//  private final CommentRecommendationRepository commentRecommendationRepository;


  public MemberResponse getMember(Long memberId) {
    Member member = memberRepository.findByMemberId(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    MemberStats stats = memberRepository.fetchStatsByMemberId(memberId); // 하드코딩된 값 예시

    return MemberResponse.of(member, stats);
  }

  public boolean existsByNickname(String nickname) {
    return memberRepository.existsByNickname(nickname);
  }

  @Transactional
  public void updateMember(Long memberId, MemberUpdateRequest req) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_INTERNAL_ERROR));

    member.setNickname(req.getNickname());
    member.setMemberProfileUrl(req.getMemberProfileUrl());
    member.setBlogUrl(req.getBlogUrl());
    member.setGithubUrl(req.getGithubUrl());
  }

  @Transactional
  public Long createOrReviveMember(MemberCreateRequest req) {

    Optional<Member> opt =
        memberRepository.findByProviderAndProviderMemberId(
            req.getProvider(), req.getProviderMemberId()
        );

    if (opt.isPresent()) {
      Member existing = opt.get();

      // 이미 탈퇴된 회원 → 정보 갱신 후 복구
      if (existing.getDeletedAt() != null) {
        existing.reviveAndUpdate();
        existing.setNickname(req.getNickname());
        existing.setMemberProfileUrl(req.getMemberProfileUrl());
        return existing.getMemberId();
      }
      // 활성화된 회원이 이미 있으면 중복 가입 에러
      throw new BusinessException(ErrorCode.AUTH_DUPLICATE_ACCOUNT);
    }

    // 신규 가입
    Member newMember = Member.of(
        req.getProvider(),
        req.getProviderMemberId(),
        req.getNickname(),
        req.getMemberProfileUrl()
    );
    memberRepository.save(newMember);
    return newMember.getMemberId();
  }

  @Transactional
  public Long resign(Long memberId) {
    Member member = memberRepository.findByMemberId(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    member.delete();

    /*
    멤버뱃지, 멤버팔로우, 회사팔로우,스타, 댓글추천, 알림의 관련 행 삭제 구현하기.
    */

    return member.getMemberId();
  }
}