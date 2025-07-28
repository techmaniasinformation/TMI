package com.tmi.backend.domain.post.controller;

import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.service.PostService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostController {

  private final PostService postService;

  // TODO: 권한 검증 구현하기
  @PostMapping
  public ApiResponse<?> createPost(
      @Valid @RequestBody PostCreateRequest postCreateRequest
  ) {

    return ApiSuccessResponse.success(postService.createPost(postCreateRequest));
  }

  @PatchMapping("{postId}")
  public ApiResponse<?> updatePost(
      @PathVariable Long postId,
      @Valid @RequestBody PostUpdateRequest postUpdateRequest
  ) {

    return ApiSuccessResponse.success(postService.updatePost(postId, postUpdateRequest));
  }

  @DeleteMapping("{postId}")
  public ApiResponse<Void> deletePost(@PathVariable Long postId) {

    postService.deletePost(postId);

    return ApiSuccessResponse.success();
  }
}
