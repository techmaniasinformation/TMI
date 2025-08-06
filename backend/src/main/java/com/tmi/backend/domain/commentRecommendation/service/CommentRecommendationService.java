package com.tmi.backend.domain.commentRecommendation.service;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.commentRecommendation.dto.request.RecommendationRequest;
import com.tmi.backend.domain.commentRecommendation.dto.response.RecommendationListResponse;
import com.tmi.backend.domain.commentRecommendation.entity.CommentRecommendation;
import com.tmi.backend.domain.commentRecommendation.respository.CommentRecommendationRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.entity.Provider;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.common.response.ServiceResult;
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
  private final CommentRepository commentRepository;
  private final CommentRecommendationRepository commentRecommendationRepository;

  @Transactional
  public ServiceResult<Map<String, Long>> recommendation(RecommendationRequest request, Long userDetailId) {
    log.info("CommentRecommendationService : recommendation() 호출");


    Comment comment = commentRepository.findById(request.commentId()).orElse(null);
    if (comment == null) {
      return ServiceResult.fail(ErrorCode.COMMENT_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (userDetailId != comment.getMember().getId() && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    if (commentRecommendationRepository.existsByMemberAndComment(comment.getMember(), comment)) {
      return ServiceResult.fail(ErrorCode.RECOMMEND_ALREADY_RECOMMENDED);
    }

    CommentRecommendation recommendation = commentRecommendationRepository.save(
        CommentRecommendation.of(comment.getMember(), comment));
    recommendation.assignToComment(comment);
    comment.plusRecommendCount();

    return ServiceResult.ok(Map.of("recommendationId", recommendation.getId()));
  }

  @Transactional
  public ServiceResult<Void> delete(Long recommendationId, Long userDetailId) {
    log.info("CommentRecommendationService : delete({}) 호출", recommendationId);

    CommentRecommendation recommendation = commentRecommendationRepository.findById(
            recommendationId).orElse(null);
    if (recommendation == null) {
      return ServiceResult.fail(ErrorCode.RECOMMEND_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (userDetailId != recommendation.getMember().getId() && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    recommendation.getComment().minusRecommendCount();
    commentRecommendationRepository.delete(recommendation);
    return ServiceResult.ok();
  }

  public ServiceResult<RecommendationListResponse> getRecommendations(Long memberId, Long postId) {
    log.info("CommentRecommendationService : getRecommendations() 호출");

    List<CommentRecommendation> list =
        commentRecommendationRepository.findAllByMemberIdAndPostId(memberId, postId);

    return ServiceResult.ok(RecommendationListResponse.from(list));
  }
}
