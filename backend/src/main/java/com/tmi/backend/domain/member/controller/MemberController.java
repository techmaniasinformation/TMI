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

  /**
   * 멤버 등록 API
   */
  @GetMapping("/{memberId}")
  public ApiResponse<MemberResponse> getMember(@PathVariable Long memberId) {
    return ApiSuccessResponse.success(memberService.getMember(memberId));
  }

  /**
   * 닉네임 중복 여부 API
   *
   * @RequestParam : 사용하려는 닉네임
   */
  @GetMapping("/duplicate")
  public ApiResponse<Map<String, Boolean>> checkNicknameDuplicate(
      @RequestParam String nickname
  ) {
    boolean isDuplicated = memberService.existsByNickname(nickname);
    return ApiSuccessResponse.success(
        Map.of("isDuplicated", isDuplicated)
    );
  }

  /**
   * 멤버 정보 수정 API
   *
   * @RequestBody : 수정된 멤버의 정보
   */
  //TODO : 권한 검증 구현하기
  @PatchMapping("/{memberId}")
  public ApiResponse<Map<String, Long>> updateMember(
      @PathVariable Long memberId,
      @Valid @RequestBody MemberUpdateRequest req
  ) {
    memberService.updateMember(memberId, req);
    return ApiSuccessResponse.success(Map.of("memberId", memberId));
  }

  /**
   * 회원가입 등록 API
   *
   * @RequestBody : 신규 회원 정보
   */
  @PostMapping
  public ApiResponse<Map<String, Long>> signup(
      @RequestBody @Valid MemberCreateRequest req
  ) {
    Long memberId = memberService.createOrReviveMember(req);
    return ApiSuccessResponse.success(
        Map.of("memberId", memberId)
    );
  }

  /**
   * 회원탈퇴(논리적 삭제) API
   */
  //TODO : 권한 검증 구현하기
  @PatchMapping("/{memberId}/delete")
  public ApiResponse<Map<String, Long>> resign(@PathVariable Long memberId) {
    Long resignMemberId = memberService.resign(memberId);
    return ApiSuccessResponse.success(
        Map.of("memberId", memberId)
    );
  }
}