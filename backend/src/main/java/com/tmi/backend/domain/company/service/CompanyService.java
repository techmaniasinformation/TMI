package com.tmi.backend.domain.company.service;

import com.tmi.backend.domain.company.dto.request.CompanyCreateRequest;
import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class CompanyService {

  private final CompanyRepository companyRepository;

  @Transactional
  public Long createCompany(CompanyCreateRequest request) {
    companyRepository.findByName(request.getName()).ifPresent(c -> {
      throw new BusinessException(ErrorCode.COMMON_INTERNAL_ERROR);
    });

    Company company = Company.builder()
        .name(request.getName())
        .companyProfileUrl(request.getCompanyProfileUrl())
        .techBlogUrl(request.getTechBlogUrl())
        .build();

    companyRepository.save(company);

    return company.getCompanyId();
  }
}