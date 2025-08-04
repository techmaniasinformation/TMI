package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postTag.service.PostTagService;
import com.tmi.backend.global.common.response.ServiceResult;
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
public class PostService {

  private final MemberRepository memberRepository;
  private final PostRepository postRepository;
  private final PostTagService postTagService;

  // TODO : 인증 로직 구현
  @Transactional
  public ServiceResult<Map<String, Long>> createPost(PostCreateRequest postCreateRequest) {
    log.info("PostService : createPost() 호출");

    Member member = memberRepository.findById(postCreateRequest.memberId()).orElse(null);
    if (member == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    Post post = Post.of(
        member,
        postCreateRequest.title(),
        postCreateRequest.link(),
        postCreateRequest.content(),
        postCreateRequest.thumbnailUrl());

    Post save = postRepository.save(post);

    postTagService.createPostTags(save, postCreateRequest.tags());

    return ServiceResult.ok(Map.of("postId", save.getId()));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> updatePost(Long postId, PostUpdateRequest postUpdateRequest) {
    log.info("PostService : updatePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    post.change(postUpdateRequest.title(), postUpdateRequest.content(),
        postUpdateRequest.link(), postUpdateRequest.thumbnailUrl());

    if (postUpdateRequest.tags() != null) {
      postTagService.updatePostTags(post, postUpdateRequest.tags());
    }

    return ServiceResult.ok(Map.of("postId", postId));
  }

  @Transactional
  public ServiceResult<Void> deletePost(Long postId) {
    log.info("PostService : deletePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId).orElse(null);
    if (post == null) {
      return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
    }

    //postTagService.deletePostTags(post.getId());
    postRepository.delete(post);

    // TODO : 게시글의 댓글까지 연쇄 삭제 필요 -> commentService 등장 이후 구현
    return ServiceResult.ok();
  }
}
