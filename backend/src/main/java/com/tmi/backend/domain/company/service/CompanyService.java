package com.tmi.backend.domain.company.service;

import com.tmi.backend.domain.company.dto.request.CompanyCreateRequest;
import com.tmi.backend.domain.company.dto.response.CompanyResponse;
import com.tmi.backend.domain.company.dto.response.CompanyStats;
import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

  private final CompanyRepository companyRepository;
  private final PostRepository postRepository;

  @Transactional
  public ServiceResult<Map<String, Long>> createCompany(CompanyCreateRequest request) {
    Company company = companyRepository.findByName(request.name()).orElse(null);
    if (company != null) {
      ServiceResult.fail(ErrorCode.COMMON_INTERNAL_ERROR);
    }
    company = Company.of(request.name(), request.companyProfileUrl(),
        request.techBlogUrl());
    companyRepository.save(company);
    return ServiceResult.ok(Map.of("companyId", company.getId()));
  }


  public ServiceResult<CompanyResponse> getCompany(Long companyId) {
    Company company = companyRepository.findById(companyId).orElse(null);
    if (company == null) {
      return ServiceResult.fail(ErrorCode.COMPANY_NOT_FOUND);
    }
    // 게시글 중 가장 최근 작성일 (없으면 회사 updatedAt 사용)
    LocalDateTime lastUpdatedAt = postRepository.findLatestCreatedAtById(companyId)
        .orElse(company.getUpdatedAt());

    CompanyStats stats = companyRepository.fetchStatsById(companyId);

    return ServiceResult.ok(CompanyResponse.of(company, lastUpdatedAt, stats));
  }
}