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
public class CompanyService {

  private final CompanyRepository companyRepository;
  private final PostRepository postRepository;

  @Transactional
  public Long createCompany(CompanyCreateRequest request) {
    companyRepository.findByName(request.getName()).ifPresent(c -> {
      throw new BusinessException(ErrorCode.COMMON_INTERNAL_ERROR);
    });

    Company company = Company.of(
        request.getName(),
        request.getCompanyProfileUrl(),
        request.getTechBlogUrl()
    );

    companyRepository.save(company);

    return company.getCompanyId();
  }

  @Transactional
  public CompanyResponse getCompany(Long companyId) {
    Company company = companyRepository.findById(companyId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMPANY_NOT_FOUND));

    CompanyStats stats = companyRepository.fetchStatsByCompanyId(companyId);

    // 게시글 중 가장 최근 작성일 (없으면 회사 updatedAt 사용)
    LocalDateTime lastUpdatedAt = postRepository.findLatestCreatedAtByCompanyId(companyId)
        .orElse(company.getUpdatedAt());

    return CompanyResponse.builder()
        .companyId(company.getCompanyId())
        .name(company.getName())
        .companyProfileUrl(company.getCompanyProfileUrl())
        .techBlogUrl(company.getTechBlogUrl())
        .lastUpdatedAt(lastUpdatedAt)
        .stats(stats)
        .build();
  }
}