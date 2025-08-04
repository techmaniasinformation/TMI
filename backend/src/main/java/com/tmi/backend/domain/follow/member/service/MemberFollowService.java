package com.tmi.backend.domain.follow.member.service;

import com.tmi.backend.domain.follow.member.dto.request.MemberFollowCreateRequest;
import com.tmi.backend.domain.follow.member.dto.response.MemberFollowListResponse;
import com.tmi.backend.domain.follow.member.dto.response.SimpleMemberFollow;
import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.memberBadge.repository.MemberBadgeRepository;
import com.tmi.backend.global.common.entity.PageDetail;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberFollowService {

  private final MemberFollowRepository followRepository;
  private final MemberRepository memberRepository;
  private final MemberBadgeRepository memberBadgeRepository;

  public MemberFollowListResponse getMemberFollows(Long followerId, int page, int size) {
    PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<SimpleMemberFollow> p = followRepository.findSimpleByFollowerId(followerId, pr);

    PageDetail pageInfo = PageDetail.of(
        p.getTotalElements(),
        p.getTotalPages(),
        p.isLast(),
        p.getNumber()
    );

    return MemberFollowListResponse.of(p.getContent(), pageInfo);
  }

  @Transactional
  public Long createFollow(MemberFollowCreateRequest req) {
    Long followerId = req.followerId();
    Long followeeId = req.followeeId();

    Member follower = memberRepository.findById(followerId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    if (follower.getDeletedAt() != null) {
      throw new BusinessException(ErrorCode.USER_NOT_FOUND);
    }

    Member followee = memberRepository.findById(followeeId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    if (followee.getDeletedAt() != null) {
      throw new BusinessException(ErrorCode.USER_NOT_FOUND);
    }
    
    if (followRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId)) {
      throw new BusinessException(ErrorCode.FOLLOW_ALREADY_FOLLOWING);
    }

    MemberFollow memberFollow = MemberFollow.of(follower, followee);
    followRepository.save(memberFollow);
    return memberFollow.getId();
  }

  @Transactional
  public Long deleteFollow(Long memberFollowId) {
    MemberFollow mf = followRepository.findById(memberFollowId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    followRepository.delete(mf);
    return memberFollowId;
  }
}