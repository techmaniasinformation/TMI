package com.tmi.backend.domain.member.controller;

import com.tmi.backend.domain.auth.service.TokenService;
import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.service.MemberService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;
  private final TokenService tokenService;
  /**
   * 멤버 조회 API
   */
  @GetMapping("/{memberId}")
  public ApiResponse<MemberResponse> getMember(@PathVariable Long memberId) {
    return ApiSuccessResponse.success(memberService.getMember(memberId));
  }

  /**
   * 닉네임 중복 여부 API
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
   * @RequestBody : 수정된 멤버의 정보
   */
  @PatchMapping("/{memberId}")
  public ApiResponse<Map<String, Long>> updateMember(
      @PathVariable Long memberId,
      @Valid @RequestBody MemberUpdateRequest req
  ) {
    Long updeatedMemberId = memberService.updateMember(memberId, req);
    return ApiSuccessResponse.success(Map.of("memberId", updeatedMemberId));
  }

  /**
   * 멤버등록 (회원가입)  API
   * @RequestBody : 신규 회원 정보
   */
  @PostMapping("/signup")
  public ResponseEntity<ApiResponse<Map<String, Long>>> signup(
      @RequestBody MemberCreateRequest req, HttpServletResponse res) {
    Long memberId = memberService.createOrReviveMember(req);
    tokenService.createAndAddAuthCookies(res, memberId);

    return ResponseEntity.ok(
        ApiSuccessResponse.success(Map.of("memberId", memberId))
    );
  }

  /**
   * 회원탈퇴(논리적 삭제) API
   */
  @PatchMapping("/{memberId}/delete")
  public ApiResponse<Map<String, Long>> deleteMember(@PathVariable Long memberId) {
    Long deletedMemberId = memberService.deleteMember(memberId);
    return ApiSuccessResponse.success(
        Map.of("memberId", deletedMemberId)
    );
  }
}