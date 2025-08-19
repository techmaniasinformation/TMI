package com.tmi.backend.domain.company.service;

import com.tmi.backend.domain.company.dto.request.CompanyCreateRequest;
import com.tmi.backend.domain.company.dto.response.CompanyResponse;
import com.tmi.backend.domain.company.dto.response.CompanyStats;
import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.Utils.FileUtil;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

  private final CompanyRepository companyRepository;
  private final PostRepository postRepository;
  private final FileUtil fileUtil;

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

  @Transactional
  public ServiceResult<Map<String, Long>> updateCompany(
      Long companyId,
      MultipartFile companyProfile,
      String techBlogUrl
  ) {
    log.info("CompanyService : updateCompany({}) 호출", companyId);

    Company company = companyRepository.findById(companyId).orElse(null);
    if (company == null) {
      return ServiceResult.fail(ErrorCode.COMPANY_NOT_FOUND);
    }

    String newProfileUrl = company.getCompanyProfileUrl();

    // 1. 새로운 프로필 이미지가 업로드된 경우
    if (companyProfile != null && !companyProfile.isEmpty()) {
      // 기존 프로필 이미지 삭제
      if (newProfileUrl != null && !newProfileUrl.isEmpty()) {
        try {
          fileUtil.deleteFile(newProfileUrl, "profile");
        } catch (IOException e) {
          log.error("기존 회사 프로필 삭제 실패: {}", newProfileUrl, e);
        }
      }

      // 새 파일 저장 + 롤백 시 삭제
      try {
        newProfileUrl = fileUtil.saveFile(companyProfile, "profile");
        final String urlToDeleteOnRollback = newProfileUrl;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
          @Override
          public void afterCompletion(int status) {
            if (status == STATUS_ROLLED_BACK) {
              try {
                fileUtil.deleteFile(urlToDeleteOnRollback, "profile");
              } catch (IOException e) {
                log.error("회사 프로필 롤백 중 파일 삭제 실패", e);
              }
            }
          }
        });
      } catch (IOException e) {
        log.error("회사 프로필 이미지 저장 실패", e);
        return ServiceResult.fail(ErrorCode.FILE_UPLOAD_ERROR);
      }
    }
    // 2. 새 파일은 없지만 기존 이미지 삭제 요청이 들어온 경우
    else if (techBlogUrl != null && techBlogUrl.isEmpty() &&
        (newProfileUrl != null && !newProfileUrl.isEmpty())) {
      try {
        fileUtil.deleteFile(newProfileUrl, "profile");
        newProfileUrl = null;
      } catch (IOException e) {
        log.error("회사 프로필 삭제 실패: {}", newProfileUrl, e);
      }
    }

    // 3. DB 업데이트 (프로필 URL, 기술 블로그 URL)
    company.updateCompany(newProfileUrl, techBlogUrl);

    return ServiceResult.ok(Map.of("companyId", companyId));
  }

}