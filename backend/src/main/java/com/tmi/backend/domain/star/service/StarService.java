package com.tmi.backend.domain.star.service;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.star.dto.response.StarListResponse;
import com.tmi.backend.domain.star.entity.Star;
import com.tmi.backend.domain.star.repository.StarRepository;
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
  public Map<String, Long> register(Long memberId, Long postId) {
    log.info("StarService : register() 호출");

    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    log.info("postId = {}", postId);
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    log.info("post title = {}", post.getTitle());


    if (starRepository.existsByMemberAndPost(member, post)) {
      throw new BusinessException(ErrorCode.STAR_ALREADY_STARRED);
    }

    Star star = starRepository.save(Star.of(member, post));

    return Map.of("starId", star.getId());
  }

  public StarListResponse readStars(Long memberId) {
    log.info("StarService : readStars(" + memberId + ") 호출");

    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    List<Star> memberStars = starRepository.findByMember(member);

    return StarListResponse.from(memberStars);
  }

  @Transactional
  public void deleteStar(Long starId) {

    Star star = starRepository.findById(starId)
        .orElseThrow(() -> new BusinessException(ErrorCode.STAR_NOT_FOUND));

    starRepository.delete(star);
  }
}
