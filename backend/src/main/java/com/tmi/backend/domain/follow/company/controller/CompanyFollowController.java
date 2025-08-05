package com.tmi.backend.domain.follow.company.controller;

import com.tmi.backend.domain.follow.company.dto.request.CompanyFollowCreateRequest;
import com.tmi.backend.domain.follow.company.dto.response.CompanyFollowListResponse;
import com.tmi.backend.domain.follow.company.service.CompanyFollowService;
import com.tmi.backend.global.aop.RequireLogin;
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
@RequestMapping("/api/v1/companyFollow")
@RequiredArgsConstructor
public class CompanyFollowController {

  private final CompanyFollowService companyFollowService;

  @RequireLogin
  @GetMapping
  public ApiResponse<CompanyFollowListResponse> getCompanyFollows(
      @RequestParam Long followerId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    CompanyFollowListResponse resp = companyFollowService.getCompanyFollows(followerId, page, size);
    return ApiSuccessResponse.success(resp);
  }

  @PostMapping
  public ApiResponse<Map<String, Long>> createFollow(
      @Valid @RequestBody CompanyFollowCreateRequest req
  ) {
    Long id = companyFollowService.createFollow(req);
    return ApiSuccessResponse.success(Map.of("companyFollowId", id));
  }

  @DeleteMapping("/{companyFollowId}")
  public ApiResponse<Map<String, Long>> deleteFollow(
      @PathVariable Long companyFollowId
  ) {
    Long id = companyFollowService.deleteFollow(companyFollowId);
    return ApiSuccessResponse.success(Map.of("companyFollowId", id));
  }
}
