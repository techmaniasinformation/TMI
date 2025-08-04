package com.tmi.backend.domain.star.service;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.star.dto.response.StarListResponse;
import com.tmi.backend.domain.star.entity.Star;
import com.tmi.backend.domain.star.repository.StarRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import jakarta.validation.constraints.Positive;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StarService {

  private final StarRepository starRepository;
  private final MemberRepository memberRepository;
  private final PostRepository postRepository;

  @Transactional
  public ServiceResult<Map<String, Long>> register(Long memberId, Long postId) {
    log.info("StarService : register() 호출");

    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }


    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    if (starRepository.existsByMemberAndPost(member, post)) {
      return ServiceResult.fail(ErrorCode.STAR_ALREADY_STARRED);
    }

    post.plusStarCount();
    Star star = starRepository.save(Star.of(member, post));

    return ServiceResult.ok(Map.of("starId", star.getId()));
  }

  public ServiceResult<StarListResponse> readStars(Long memberId) {
    log.info("StarService : readStars(" + memberId + ") 호출");

    Member member = memberRepository.findById(memberId).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    List<Star> memberStars = starRepository.findByMember(member);

    return ServiceResult.ok(StarListResponse.from(memberStars));
  }

  @Transactional
  public ServiceResult<Void> deleteStar(Long starId) {

    Star star = starRepository.findById(starId).orElse(null);
    if (star == null) {
      return ServiceResult.fail(ErrorCode.STAR_ALREADY_STARRED);
    }

    star.getPost().minusStarCount();
    starRepository.delete(star);

    return ServiceResult.ok();
  }
}
