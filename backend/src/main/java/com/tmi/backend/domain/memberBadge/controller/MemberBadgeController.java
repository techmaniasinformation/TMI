package com.tmi.backend.domain.memberBadge.controller;

import com.tmi.backend.domain.memberBadge.dto.response.MemberBadgeListResponse;
import com.tmi.backend.domain.memberBadge.service.MemberBadgeService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/memberBadge")
@RequiredArgsConstructor
public class MemberBadgeController implements BaseController {

  private final MemberBadgeService memberBadgeService;

  /**
   * 멤버가 획득한 모든 뱃지 조회 API
   */
  @GetMapping
  public ResponseEntity<ApiResponse<MemberBadgeListResponse>> getMemberBadges(
      @RequestParam Long memberId
  ) {
    return handle(memberBadgeService.getMemberBadges(memberId));
  }

  /**
   * 대표 뱃지 업데이트 API
   */
  @PatchMapping("/{memberBadgeId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> updateRepresentative(
      @PathVariable Long memberBadgeId
  ) {

    return handle(memberBadgeService.updateRepresentative(memberBadgeId));
  }
}
