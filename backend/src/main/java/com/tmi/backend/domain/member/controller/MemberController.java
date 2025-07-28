package com.tmi.backend.domain.member.controller;

import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.service.MemberService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  @GetMapping("/{memberId}")
  public ApiResponse<MemberResponse> getMember(@PathVariable Long memberId) {
    return ApiSuccessResponse.success(memberService.getMember(memberId));
  }

  @GetMapping("/duplicate")
  public ApiResponse<Map<String, Boolean>> checkNicknameDuplicate(
      @RequestParam String nickname
  ) {
    boolean isDuplicated = memberService.existsByNickname(nickname);
    return ApiSuccessResponse.success(
        Map.of("isDuplicated", isDuplicated)
    );
  }

  @PatchMapping("/{memberId}")
  public ApiResponse<Map<String, Long>> updateMember(
      @PathVariable Long memberId,
      @Valid @RequestBody MemberUpdateRequest req
  ) {
    memberService.updateMember(memberId, req);
    return ApiSuccessResponse.success(Map.of("memberId", memberId));
  }

  @PostMapping
  public ApiResponse<Map<String, Long>> signup(
      @RequestBody @Valid MemberCreateRequest req
  ) {
    Long memberId = memberService.createOrReviveMember(req);
    return ApiSuccessResponse.success(
        Map.of("memberId", memberId)
    );
  }

  @PatchMapping("/{memberId}/delete")
  public ApiResponse<Map<String, Long>> resign(@PathVariable Long memberId) {
    Long resignMemberId = memberService.resign(memberId);
    return ApiSuccessResponse.success(
        Map.of("memberId", memberId)
    );
  }
}