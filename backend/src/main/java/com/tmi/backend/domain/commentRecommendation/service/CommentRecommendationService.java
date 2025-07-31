package com.tmi.backend.domain.commentRecommendation.service;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.commentRecommendation.dto.request.RecommendationRequest;
import com.tmi.backend.domain.commentRecommendation.dto.response.RecommendationListResponse;
import com.tmi.backend.domain.commentRecommendation.entity.CommentRecommendation;
import com.tmi.backend.domain.commentRecommendation.respository.CommentRecommendationRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
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
public class CommentRecommendationService {

  private final MemberRepository memberRepository;
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;
  private final CommentRecommendationRepository commentRecommendationRepository;

  @Transactional
  public Map<String, Long> recommendation(RecommendationRequest request) {
    log.info("CommentRecommendationService : recommendation() 호출");

    Member member = memberRepository.findById(request.memberId())
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    Comment comment = commentRepository.findById(request.commentId())
        .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

    if (commentRecommendationRepository.existsByMemberAndComment(member, comment)) {
      throw new BusinessException(ErrorCode.RECOMMEND_ALREADY_RECOMMENDED);
    }

    CommentRecommendation recommendation = commentRecommendationRepository.save(
        CommentRecommendation.of(member, comment));
    recommendation.assignToComment(comment);
    comment.plusRecommendCount();

    return Map.of("recommendationId", recommendation.getId());
  }

  @Transactional
  public void delete(Long recommendationId) {
    log.info("CommentRecommendationService : delete({}) 호출", recommendationId);

    CommentRecommendation recommendation = commentRecommendationRepository.findById(
            recommendationId)
        .orElseThrow(() -> new BusinessException(ErrorCode.RECOMMEND_NOT_FOUND));

    recommendation.getComment().minusRecommendCount();
    commentRecommendationRepository.delete(recommendation);
  }

  public RecommendationListResponse getRecommendations(Long memberId, Long postId) {
    log.info("CommentRecommendationService : getRecommendations() 호출");

    List<CommentRecommendation> list =
        commentRecommendationRepository.findAllByMemberIdAndPostId(memberId, postId);

    return RecommendationListResponse.from(list);
  }
}
