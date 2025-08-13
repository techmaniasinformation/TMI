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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${api.prefix}/company")
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
   *
   * @RequestBody : 등록할 기업의 정보
   */
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> createCompany(
      @Valid @RequestBody CompanyCreateRequest request
  ) {
    return handle(companyService.createCompany(request));
  }

  /**
   * 기업 정보 수정 API
   *
   * @param companyId      수정할 기업 ID
   * @param companyProfile 기업 프로필 이미지 (선택)
   * @param techBlogUrl    기술 블로그 URL (선택)
   */
  @PutMapping("/{companyId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> updateCompany(
      @PathVariable Long companyId,
      @RequestPart(value = "company_profile", required = false) MultipartFile companyProfile,
      @RequestPart(value = "tech_blog_url", required = false) String techBlogUrl
  ) {
    return handle(companyService.updateCompany(companyId, companyProfile, techBlogUrl));
  }
}