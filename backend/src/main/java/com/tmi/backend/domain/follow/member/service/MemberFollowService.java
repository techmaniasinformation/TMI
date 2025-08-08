package com.tmi.backend.domain.follow.member.service;

import com.tmi.backend.domain.auth.util.SecurityUtil;
import com.tmi.backend.domain.follow.member.dto.request.MemberFollowCreateRequest;
import com.tmi.backend.domain.follow.member.dto.response.MemberFollowListResponse;
import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import com.tmi.backend.domain.follow.member.repository.MemberFollowRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.memberBadge.repository.MemberBadgeRepository;
import com.tmi.backend.domain.notification.event.FollowAddedEvent;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
  private final MemberBadgeRepository memberBadgeRepository;  // ← 수정
  private final ApplicationEventPublisher publisher;

  public ServiceResult<MemberFollowListResponse> getMemberFollows(
      Long followerId,
      int page,
      int size
  ) {
    PageRequest pr = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<MemberFollow> p = followRepository.findByFollowerId(followerId, pr);

    List<Long> followeeIds = p.stream()
        .map(mf -> mf.getFollowee().getId())
        .toList();

    Map<Long, String> badgeMap = followeeIds.isEmpty()
        ? Collections.emptyMap()
        : memberBadgeRepository.findAllByMemberIdInAndIsRepresentativeTrue(followeeIds).stream()
            .collect(Collectors.toMap(
                mb -> mb.getMember().getId(),
                mb -> mb.getBadge().getBadgeUrl()
            ));

    return ServiceResult.ok(
        MemberFollowListResponse.of(p, badgeMap)
    );
  }

  @Transactional
  public ServiceResult<Map<String, Long>> createFollow(MemberFollowCreateRequest req) {
    Long followerId = req.followerId();
    Long followeeId = req.followeeId();

    if (followerId.equals(followeeId)) {
      return ServiceResult.fail(ErrorCode.FOLLOW_INVALID_REQUEST);
    }
    List<Member> members = memberRepository.findAllById(List.of(followerId, followeeId));

    Map<Long, Member> memberMap = members.stream()
        .collect(Collectors.toMap(Member::getId, Function.identity()));

    Member follower = memberMap.get(followerId);
    Member followee = memberMap.get(followeeId);

    if (members.size() != 2 || follower.getDeletedAt() != null
        || followee.getDeletedAt() != null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }
    
    if (followRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId)) {
      return ServiceResult.fail(ErrorCode.FOLLOW_ALREADY_FOLLOWING);
    }

    MemberFollow memberFollow = MemberFollow.of(follower, followee);
    followRepository.save(memberFollow);

    publisher.publishEvent(new FollowAddedEvent(followeeId));

    return ServiceResult.ok(Map.of("memberFollowId", memberFollow.getId()));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> deleteFollow(Long memberFollowId) {
    MemberFollow mf = followRepository.findFollowerIdById(memberFollowId);
    if (!SecurityUtil.memberCheck(mf.getFollower().getId())) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    int deleted = followRepository.removeById(memberFollowId);
    if (deleted == 0) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }
    return ServiceResult.ok(Map.of("memberFollowId", memberFollowId));
  }

}