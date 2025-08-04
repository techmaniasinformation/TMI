package com.tmi.backend.domain.follow.member.controller;

import com.tmi.backend.domain.follow.member.dto.request.MemberFollowCreateRequest;
import com.tmi.backend.domain.follow.member.dto.response.MemberFollowListResponse;
import com.tmi.backend.domain.follow.member.service.MemberFollowService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/memberFollow")
@RequiredArgsConstructor
public class MemberFollowController {

  private final MemberFollowService memberFollowService;

  /**
   * 팔로우 목록 조회 API
   */
  @GetMapping
  public ApiResponse<MemberFollowListResponse> getMemberFollows(
      @RequestParam Long followerId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    MemberFollowListResponse resp = memberFollowService.getMemberFollows(followerId, page, size);
    return ApiSuccessResponse.success(resp);
  }

  /**
   * 팔로우 등록 API
   */
  @PostMapping
  public ApiResponse<Map<String, Long>> createFollow(
      @Valid @RequestBody MemberFollowCreateRequest req

  ) {
    Long memberFollowId = memberFollowService.createFollow(req);
    return ApiSuccessResponse.success(Map.of("memberFollowId", memberFollowId));
  }

  /**
   * 팔로우 취소
   */
  @DeleteMapping("/{memberFollowId}")
  public ApiResponse<Map<String, Long>> deleteFollow(
      @PathVariable Long memberFollowId
  ) {
    Long deletedId = memberFollowService.deleteFollow(memberFollowId);
    return ApiSuccessResponse.success(Map.of("memberFollowId", deletedId));
  }
}