package com.tmi.backend.domain.follow.company.service;

import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.follow.company.dto.request.CompanyFollowCreateRequest;
import com.tmi.backend.domain.follow.company.dto.response.CompanyFollowListResponse;
import com.tmi.backend.domain.follow.company.entity.CompanyFollow;
import com.tmi.backend.domain.follow.company.repository.CompanyFollowRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyFollowService {

  private final CompanyFollowRepository followRepository;
  private final MemberRepository memberRepository;
  private final CompanyRepository companyRepository;

  public ServiceResult<CompanyFollowListResponse> getCompanyFollows(
      Long followerId, int page, int size, boolean all
  ) {
    Pageable pageable;
    if (all) {
      pageable = Pageable.unpaged();
    } else {
      pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    }

    Page<CompanyFollow> p = followRepository.findByFollowerId(followerId, pageable);

    return ServiceResult.ok(
        CompanyFollowListResponse.from(p)
    );
  }

  @Transactional
  public ServiceResult<Map<String, Long>> createFollow(CompanyFollowCreateRequest req) {
    Long followerId = req.followerId();
    Long companyId = req.companyId();

    if (followRepository.existsByFollowerIdAndCompanyId(followerId, companyId)) {
      return ServiceResult.fail(ErrorCode.FOLLOW_ALREADY_FOLLOWING);
    }

    Member follower = memberRepository.findById(followerId).orElse(null);
    if (follower == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    Company company = companyRepository.findById(companyId).orElse(null);
    if (company == null) {
      return ServiceResult.fail(ErrorCode.COMPANY_NOT_FOUND);
    }

    CompanyFollow cf = CompanyFollow.of(follower, company);
    followRepository.save(cf);
    return ServiceResult.ok(Map.of("companyFollowId", cf.getId()));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> deleteFollow(Long companyFollowId) {

    int deleted = followRepository.removeById(companyFollowId);
    if (deleted == 0) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }
    return ServiceResult.ok(Map.of("companyFollowId", companyFollowId));
  }
}
