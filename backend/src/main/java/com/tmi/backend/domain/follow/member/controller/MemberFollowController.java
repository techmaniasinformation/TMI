package com.tmi.backend.domain.follow.member.controller;

import com.tmi.backend.domain.follow.member.dto.request.MemberFollowCreateRequest;
import com.tmi.backend.domain.follow.member.dto.response.MemberFollowListResponse;
import com.tmi.backend.domain.follow.member.service.MemberFollowService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
public class MemberFollowController implements BaseController {

  private final MemberFollowService memberFollowService;

  /**
   * 멤버 팔로우 목록 조회 API
   */
  @GetMapping
  public ResponseEntity<ApiResponse<MemberFollowListResponse>> getMemberFollows(
      @RequestParam Long followerId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    return handle(memberFollowService.getMemberFollows(followerId, page, size));
  }

  /**
   * 멤버 팔로우 등록 API
   */
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> createFollow(
      @Valid @RequestBody MemberFollowCreateRequest req

  ) {
    return handle(memberFollowService.createFollow(req));
  }

  /**
   * 멤버 팔로우 취소
   */
  @DeleteMapping("/{memberFollowId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> deleteFollow(
      @PathVariable Long memberFollowId
  ) {
    return handle(memberFollowService.deleteFollow(memberFollowId));
  }
}