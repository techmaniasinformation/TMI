package com.tmi.backend.domain.post.controller;

import com.tmi.backend.domain.auth.util.CustomUserDetails;
import com.tmi.backend.domain.post.dto.request.PostCreateRequest;
import com.tmi.backend.domain.post.dto.request.PostUpdateRequest;
import com.tmi.backend.domain.post.service.PostService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
public class PostController implements BaseController {

  private final PostService postService;

  /**
   * 게시글 등록 API
   * @param postCreateRequest 게시글 등록 정보
   */
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> createPost(
      @Valid @RequestBody PostCreateRequest postCreateRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(postService.createPost(postCreateRequest, userDetails.getMemberId()));
  }

  /**
   * 게시글 수정 API
   * @param postId 수정할 게시글 id
   * @param postUpdateRequest 게시글 수정 정보
   */
  @PatchMapping("/{postId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> updatePost(
      @PathVariable Long postId,
      @Valid @RequestBody PostUpdateRequest postUpdateRequest,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(postService.updatePost(postId, postUpdateRequest, userDetails.getMemberId()));
  }

  /**
   * 게시글 삭제 API
   * @param postId 삭제할 게시글 id
   */
  @DeleteMapping("/{postId}")
  public ResponseEntity<ApiResponse<Void>> deletePost(
      @PathVariable Long postId,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(postService.deletePost(postId, userDetails.getMemberId()));
  }
}
