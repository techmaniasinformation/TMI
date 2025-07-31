package com.tmi.backend.domain.comment.service;

import com.tmi.backend.domain.comment.dto.request.CommentRequest;
import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.comment.repository.CommentRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.star.entity.Star;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
  public Map<String, Long> register(CommentRequest commentRequest) {
    log.info("CommentService : register() 호출");

    Member member = memberRepository.findById(commentRequest.memberId())
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    Post post = postRepository.findById(commentRequest.postId())
        .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

    Comment comment = commentRepository.save(Comment.of(post, member, commentRequest.comment(),
        commentRequest.link()));

    return Map.of("commentId", comment.getId());
  }

  @Transactional
  public void delete(Long commentId) {
    log.info("CommentService : delete({}) 호출", commentId);

    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

    commentRepository.delete(comment);
  }
}
