package com.tmi.backend.domain.post.controller;

import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostPageResponse;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchResponse;
import com.tmi.backend.domain.post.service.PostViewLegacyService;
import com.tmi.backend.domain.post.service.PostViewService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostViewController implements BaseController {

  private final PostViewService postViewService;

  /**
   * 게시글 조회 API, 다음을 포함합니다
   * - 최신 게시글 가져오기
   * - 팔로우한 게시글 가져오기
   * - 멤버기 작성한 게시글 가져오기
   * - 회사의 게시글 가져오기
   * - 스타 누른 게시글 가져오기
   * @param filter 조회할 파라미터 확인
   */
  @GetMapping()
  public ResponseEntity<ApiResponse<SimplePostPageResponse>> readPosts(
      @Valid @ModelAttribute PostFilter filter,
      @Positive @RequestParam(defaultValue = "1") int page,
      @Positive @RequestParam(defaultValue = "10") int size
  ) {

    return handle(postViewService.readPosts(filter, page, size));
  }

  /**
   * 게시글 검색 API
   * - 검색어와 기술 태그, 기업 태그로 해당 게시글을 검색할 수 있습니다.
   * @param filter 검색어 및 검색 태그
   */
  @GetMapping("/search")
  public ResponseEntity<ApiResponse<SimplePostSearchResponse>> searchPosts(
      @ModelAttribute PostSearchFilter filter,
      @Positive @RequestParam(defaultValue = "1") int page,
      @Positive @RequestParam(defaultValue = "10") int size
  ) {

    return handle(postViewService.searchPosts(filter, size, page));
  }

  /**
   * 게시글 상세 조회 API
   * @param postId 해당 게시글 id
   */
  @GetMapping("/{postId}")
  public ResponseEntity<ApiResponse<DetailPostResponse>> readDetailPost(
      @Positive @PathVariable Long postId) {

    return handle(postViewService.readDetailPost(postId));
  }

  /**
   * 인기 게시글 조회 API
   */
  @GetMapping("/popular")
  public ResponseEntity<ApiResponse<SimplePostPageResponse>> readPopularPosts(
      @Positive @RequestParam(defaultValue = "10") int size
  ) {
    return handle(postViewService.readPopularPosts(size));
  }
}
