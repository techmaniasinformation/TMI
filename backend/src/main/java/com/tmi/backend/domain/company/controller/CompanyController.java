package com.tmi.backend.domain.company.controller;

import com.tmi.backend.domain.company.dto.request.CompanyCreateRequest;
import com.tmi.backend.domain.company.dto.response.CompanyResponse;
import com.tmi.backend.domain.company.service.CompanyService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController implements BaseController {

  private final CompanyService companyService;

  /**
   * 기업 정보 조회 API
   */
  @GetMapping("/{companyId}")
  public ResponseEntity<ApiResponse<CompanyResponse>> getCompany(@PathVariable Long companyId) {
    return handle(companyService.getCompany(companyId));
  }

  /**
   * 기업 등록 API
   * @RequestBody : 등록할 기업의 정보
   */
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> createCompany(
      @Valid @RequestBody CompanyCreateRequest request
  ) {
    return handle(companyService.createCompany(request));
  }


}