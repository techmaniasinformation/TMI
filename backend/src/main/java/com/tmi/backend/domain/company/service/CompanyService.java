package com.tmi.backend.domain.company.service;

import com.tmi.backend.domain.company.dto.request.CompanyCreateRequest;
import com.tmi.backend.domain.company.dto.response.CompanyResponse;
import com.tmi.backend.domain.company.dto.response.CompanyStats;
import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import java.time.LocalDateTime;
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
  public Long createCompany(CompanyCreateRequest request) {
    companyRepository.findByName(request.name()).ifPresent(c -> {
      throw new BusinessException(ErrorCode.COMMON_INTERNAL_ERROR);
    });

    Company company = Company.of(request.name(), request.companyProfileUrl(),
        request.techBlogUrl());

    companyRepository.save(company);
    return company.getId();
  }

  public CompanyResponse getCompany(Long companyId) {
    Company company = companyRepository.findById(companyId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMPANY_NOT_FOUND));

    // 게시글 중 가장 최근 작성일 (없으면 회사 updatedAt 사용)
    LocalDateTime lastUpdatedAt = postRepository.findLatestCreatedAtById(companyId)
        .orElse(company.getUpdatedAt());

    CompanyStats stats = companyRepository.fetchStatsById(companyId);

    return CompanyResponse.of(company, lastUpdatedAt, stats);
  }
}