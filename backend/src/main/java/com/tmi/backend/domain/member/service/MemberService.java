package com.tmi.backend.domain.member.service;


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
public class MemberService {

  private final MemberRepository memberRepository;

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

}
