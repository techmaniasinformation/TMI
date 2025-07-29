package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postTag.service.PostTagService;
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

  private final PostRepository postRepository;
  private final PostTagService postTagService;

  @Transactional
  public Map<String, Long> createPost(PostCreateRequest postCreateRequest) {
    log.info("PostService : createPost() 호출");

    // TODO : member, company null 값 빼기 -> memberRepository 등장 이후에 구현
    Post post = Post.of(
        null,
        null,
        postCreateRequest.title(),
        postCreateRequest.link(),
        postCreateRequest.content(),
        postCreateRequest.thumbnailUrl());

    postRepository.save(post);

    postTagService.createPostTags(post, postCreateRequest.tags());

    return Map.of("postId", post.getId());
  }

  @Transactional
  public Map<String, Long> updatePost(Long postId, PostUpdateRequest postUpdateRequest) {
    log.info("PostService : updatePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

    post.change(postUpdateRequest.title(), postUpdateRequest.content(),
        postUpdateRequest.link(), postUpdateRequest.thumbnailUrl());

    if (postUpdateRequest.tags() != null) {
      postTagService.updatePostTags(post, postUpdateRequest.tags());
    }

    return Map.of("PostId", postId);
  }

  @Transactional
  public void deletePost(Long postId) {
    log.info("PostService : deletePost(" + postId + ") 호출");

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

    postRepository.delete(post);

    postTagService.deletePostTags(post.getId());

    // TODO : 게시글의 댓글까지 연쇄 삭제 필요 -> commentService 등장 이후 구현
  }
}
