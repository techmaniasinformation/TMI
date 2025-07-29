package com.tmi.backend.domain.company.controller;

import com.tmi.backend.domain.company.dto.request.CompanyCreateRequest;
import com.tmi.backend.domain.company.dto.response.CompanyResponse;
import com.tmi.backend.domain.company.service.CompanyService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

  private final CompanyService companyService;

  /**
   * 기업 정보 조회 API
   */
  @GetMapping("/{companyId}")
  public ApiResponse<CompanyResponse> getCompany(@PathVariable Long companyId) {
    CompanyResponse response = companyService.getCompany(companyId);
    return ApiSuccessResponse.success(response);
  }

  /**
   * 기업 등록 API
   *
   * @RequestBody : 등록할 기업의 정보
   */
  @PostMapping
  public ApiResponse<Map<String, Long>> createCompany(
      @Valid @RequestBody CompanyCreateRequest request
  ) {
    Long companyId = companyService.createCompany(request);
    return ApiSuccessResponse.success(Map.of("companyId", companyId));
  }


}