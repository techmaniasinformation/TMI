package com.tmi.backend.domain.member.controller;

import com.tmi.backend.domain.auth.jwt.provider.JwtTokenProvider;
import com.tmi.backend.domain.auth.jwt.service.RefreshTokenService;
import com.tmi.backend.domain.auth.jwt.service.TokenService;
import com.tmi.backend.domain.auth.util.CustomUserDetails;
import com.tmi.backend.domain.member.dto.request.MemberCreateRequest;
import com.tmi.backend.domain.member.dto.request.MemberUpdateRequest;
import com.tmi.backend.domain.member.dto.response.MemberResponse;
import com.tmi.backend.domain.member.service.MemberService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import com.tmi.backend.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
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
public class MemberController implements BaseController {

  private final MemberService memberService;
  private final TokenService tokenService;
  private final RefreshTokenService refreshTokenService;
  private final JwtTokenProvider jwtTokenProvider;

  /**
   * 멤버 조회 API
   */
  @GetMapping("/{memberId}")
  public ResponseEntity<ApiResponse<MemberResponse>> getMember(@PathVariable Long memberId) {
    return handle(memberService.getMember(memberId));
  }

  /**
   * 닉네임 중복 여부 API
   * @RequestParam : 사용하려는 닉네임
   */
  @GetMapping("/duplicate")
  public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkNicknameDuplicate(
      @RequestParam String nickname
  ) {
    return handle(memberService.existsByNickname(nickname));

  }

  /**
   * 멤버 정보 수정 API
   * @RequestBody : 수정된 멤버의 정보
   */
  @PatchMapping("/{memberId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> updateMember(
      @PathVariable Long memberId,
      @Valid @RequestBody MemberUpdateRequest req,
      @AuthenticationPrincipal CustomUserDetails userDetail
  ) {

    return handle(memberService.updateMember(memberId, req));
  }

  /**
   * 멤버등록 (회원가입)  API
   * @RequestBody : 신규 회원 정보
   */
  @PostMapping("/signup")
  public ResponseEntity<ApiResponse<Map<String, Long>>> signup(
      @RequestBody MemberCreateRequest req, HttpServletResponse res,
      @CookieValue(name = "regToken", required = true) String regToken) {
    if (!jwtTokenProvider.validateToken(regToken)) {
      return handle(ServiceResult.fail(ErrorCode.USER_SIGN_UP_FAIL));
    }
    Long memberId = memberService.createOrReviveMember(req);
    tokenService.createAndAddAuthCookies(res, memberId);

    return handle(ServiceResult.ok(Map.of("memberId", memberId)));
  }

  /**
   * 회원탈퇴(논리적 삭제) API
   */
  @PatchMapping("/{memberId}/delete")
  public ApiResponse<Map<String, Long>> deleteMember(@PathVariable Long memberId,
      HttpServletResponse res) {
    Long deletedMemberId = memberService.deleteMember(memberId);
    tokenService.deleteAuthCookies(res);
    refreshTokenService.deleteByMemberId(deletedMemberId);
    return ApiSuccessResponse.success(
        Map.of("memberId", deletedMemberId)
    );
  }
}