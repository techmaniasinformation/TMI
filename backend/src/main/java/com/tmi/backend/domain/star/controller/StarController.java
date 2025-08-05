package com.tmi.backend.domain.star.controller;

import com.tmi.backend.domain.auth.util.CustomUserDetails;
import com.tmi.backend.domain.star.dto.request.StarRegisterRequest;
import com.tmi.backend.domain.star.dto.response.StarListResponse;
import com.tmi.backend.domain.star.service.StarService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/star")
@RequiredArgsConstructor
public class StarController implements BaseController {

  private final StarService starService;

  /**
   * 스타 등록 API
   * @param request 멤버 id 와 게시글 id 를 받습니다.
   */
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> starRegister(
      @Valid @RequestBody StarRegisterRequest request,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(starService.register(request.memberId(), request.postId(), userDetails.getMemberId()));
  }

  /**
   * 멤버 스타 등록 조회 API
   * @param memberId 원하는 사용자의 id
   * @return 스타 id 와 게시글 id 를 목록으로 반환합니다.
   */
  @GetMapping
  public ResponseEntity<ApiResponse<StarListResponse>> getStarList(@Positive @RequestParam Long memberId) {

    return handle(starService.readStars(memberId));
  }

  /**
   * 스타 취소 API
   * @param starId 취소하려는 스타 id
   */
  @DeleteMapping("/{starId}")
  public ResponseEntity<ApiResponse<Void>> deleteStar(
      @PathVariable Long starId,
      @AuthenticationPrincipal CustomUserDetails userDetails
  ) {

    return handle(starService.deleteStar(starId, userDetails.getMemberId()));
  }
}
