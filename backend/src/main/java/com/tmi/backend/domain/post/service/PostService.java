package com.tmi.backend.domain.post.service;

import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.domain.postTag.service.PostTagService;
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
  public Long create(PostCreateRequest postCreateRequest) {
    log.info("PostService : create() 호출");

    Post post = Post.of(
        null,
        null,
        postCreateRequest.title(),
        postCreateRequest.link(),
        postCreateRequest.content(),
        postCreateRequest.thumbnailUrl());

    postRepository.save(post);

    postTagService.createPostTags(post, postCreateRequest.tags());

    return post.getId();
  }
}
