package com.tmi.backend.domain.post.controller;

import com.tmi.backend.domain.post.dto.request.PostFilter;
import com.tmi.backend.domain.post.dto.request.PostSearchFilter;
import com.tmi.backend.domain.post.dto.response.DetailPostRequest;
import com.tmi.backend.domain.post.dto.response.SimplePostPageRequest;
import com.tmi.backend.domain.post.dto.response.SimplePostSearchRequest;
import com.tmi.backend.domain.post.service.PostViewService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostViewController {

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
  public ApiResponse<SimplePostPageRequest> readPosts(
      @Valid @ModelAttribute PostFilter filter,
      @Positive @RequestParam(defaultValue = "1") int page,
      @Positive @RequestParam(defaultValue = "10") int size
  ) {

    return ApiSuccessResponse.success(postViewService.readPosts(
        filter,
        page,
        size
    ));
  }

  /**
   * 게시글 검색 API
   * - 검색어와 기술 태그, 기업 태그로 해당 게시글을 검색할 수 있습니다.
   * @param filter 검색어 및 검색 태그
   */
  @GetMapping("/search")
  public ApiResponse<SimplePostSearchRequest> searchPosts(
      @ModelAttribute PostSearchFilter filter,
      @Positive @RequestParam(defaultValue = "1") int page,
      @Positive @RequestParam(defaultValue = "10") int size
  ) {

    return ApiSuccessResponse.success(postViewService.searchPosts(filter, size, page));
  }

  /**
   * 게시글 상세 조회 API
   * @param postId 해당 게시글 id
   */
  @GetMapping("/{postId}")
  public ApiResponse<DetailPostRequest> readDetailPost(@Positive @PathVariable Long postId) {

    return ApiSuccessResponse.success(postViewService.readDetailPost(postId));
  }

  /**
   * 인기 게시글 조회 API
   */
  @GetMapping("/popular")
  public ApiResponse<SimplePostPageRequest> readPopularPosts(
      @Positive @RequestParam(defaultValue = "10") int size
  ) {
    return ApiSuccessResponse.success(postViewService.readPopularPosts(size));
  }
}
