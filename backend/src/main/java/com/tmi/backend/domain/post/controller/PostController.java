package com.tmi.backend.domain.post.controller;

import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.service.PostService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostController {

  private final PostService postService;

  @PostMapping
  public ApiResponse<?> createPost(
      @RequestBody PostCreateRequest postCreateRequest
  ) {

    Long postId = postService.create(postCreateRequest);

    return ApiSuccessResponse.success("PostId", postId);
  }

}
