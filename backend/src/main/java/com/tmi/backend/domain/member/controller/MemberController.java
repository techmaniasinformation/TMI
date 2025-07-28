package com.tmi.backend.domain.member.controller;

import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.service.MemberService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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

//
//  @PatchMapping("/{memberId}")
//  public ResponseEntity<Void> updateMember(@PathVariable Long memberId,
//      @RequestBody MemberUpdateRequest request) {
//    memberService.updateMember(memberId, request);
//    return ResponseEntity.noContent().build();
//  }
//
//  @DeleteMapping("/{memberId}")
//  public ResponseEntity<Void> deleteMember(@PathVariable Long memberId) {
//    memberService.deleteMember(memberId);
//    return ResponseEntity.noContent().build();
//  }
}
