package com.tmi.backend.domain.follow.company.controller;

import com.tmi.backend.domain.auth.util.SecurityUtil;
import com.tmi.backend.domain.follow.company.dto.request.CompanyFollowCreateRequest;
import com.tmi.backend.domain.follow.company.dto.response.CompanyFollowListResponse;
import com.tmi.backend.domain.follow.company.service.CompanyFollowService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
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
@RequestMapping("/api/v1/companyFollow")
@RequiredArgsConstructor
public class CompanyFollowController implements BaseController {

  private final CompanyFollowService companyFollowService;

  /**
   * 기업 팔로우 목록 조회 API
   */
  @GetMapping
  public ResponseEntity<ApiResponse<CompanyFollowListResponse>> getCompanyFollows(
      @RequestParam Long followerId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "false") boolean all
  ) {
    if (!SecurityUtil.memberCheck(followerId)) {
      return handle(ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED));
    }
    ;
    return handle(companyFollowService.getCompanyFollows(followerId, page, size, all));
  }

  /**
   * 기업 팔로우 등록 API
   */
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> createFollow(
      @Valid @RequestBody CompanyFollowCreateRequest req
  ) {
    if (!SecurityUtil.memberCheck(req.followerId())) {
      return handle(ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED));
    }
    return handle(companyFollowService.createFollow(req));
  }

  /**
   * 기업 팔로우 취소 API
   */
  @DeleteMapping("/{companyFollowId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> deleteFollow(
      @PathVariable Long companyFollowId
  ) {
    return handle(companyFollowService.deleteFollow(companyFollowId));
  }
}
