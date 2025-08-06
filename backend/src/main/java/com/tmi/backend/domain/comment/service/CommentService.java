package com.tmi.backend.domain.comment.service;

import com.tmi.backend.domain.comment.dto.request.CommentRequest;
import com.tmi.backend.domain.comment.dto.request.SortType;
import com.tmi.backend.domain.comment.dto.response.MyCommentListResponse;
import com.tmi.backend.domain.comment.dto.response.PostCommentListResponse;
import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
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
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

  private final CommentRepository commentRepository;
  private final MemberRepository memberRepository;
  private final PostRepository postRepository;

  @Transactional
  public ServiceResult<Map<String, Long>> register(CommentRequest commentRequest, Long userDetailId) {
    log.info("CommentService : register() 호출");

    Member member = memberRepository.findById(commentRequest.memberId()).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (userDetailId != member.getId() && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    Post post = postRepository.findById(commentRequest.postId()).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    Comment comment = commentRepository.save(Comment.of(post, member, commentRequest.comment(),
        commentRequest.link()));

    return ServiceResult.ok(Map.of("commentId", comment.getId()));
  }

  @Transactional
  public ServiceResult<Void> delete(Long commentId, Long userDetailId) {
    log.info("CommentService : delete({}) 호출", commentId);

    Comment comment = commentRepository.findById(commentId).orElse(null);
    if (comment == null) {
      return ServiceResult.fail(ErrorCode.COMMENT_NOT_FOUND);
    }

    Member user = memberRepository.findById(userDetailId).orElse(null);
    if (user == null || (userDetailId != comment.getMember().getId() && user.getProvider() != Provider.ADMIN)) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    commentRepository.deleteById(commentId);
    return ServiceResult.ok();
  }

  public ServiceResult<MyCommentListResponse> readMemberComments(Long memberId, int page, int size) {
    log.info("CommentService : readMemberComments({}) 호출", memberId);

    Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

    Page<Comment> commentPage = commentRepository.findByMemberId(memberId, pageable);

    return ServiceResult.ok(MyCommentListResponse.of(commentPage, page));
  }

  public ServiceResult<PostCommentListResponse> readPostComments(Long postId, SortType sort) {
    log.info("CommentService : readPostComments({}) 호출", postId);

    Comment best = commentRepository
        .findTopByRecommendCountGreaterThanEqualOrderByRecommendCountDescCreatedAtAsc(5)
        .orElse(null);

    List<Comment> comments = commentRepository.findByPostId(postId, convertSort(sort));

    return ServiceResult.ok(PostCommentListResponse.of(best, comments));
  }

  private Sort convertSort(SortType sortType) {
    return switch (sortType) {
      case oldest -> Sort.by("createdAt").ascending();           // 오래된 순
      case popular  -> Sort.by("recommendCount").descending()      // 추천 ↑
          .and(Sort.by("createdAt").ascending());
    };
  }
}
