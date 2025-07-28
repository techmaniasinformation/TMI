package com.tmi.backend.domain.member.service;


import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.dto.response.MemberStats;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
//
//  @Transactional
//  public void updateMember(Long memberId, MemberUpdateRequest request) {
//    Member member = getMember(memberId);
//    member.update(request.getNickname(), request.getMemberProfileUrl(),
//        request.getBlogUrl(), request.getGithubUrl());
//  }
//
//  @Transactional
//  public void deleteMember(Long memberId) {
//    Member member = getMember(memberId);
//    memberRepository.delete(member);
//  }
}
