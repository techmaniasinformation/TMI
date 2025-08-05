package com.tmi.backend.domain.follow.company.service;

import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.follow.company.dto.request.CompanyFollowCreateRequest;
import com.tmi.backend.domain.follow.company.dto.response.CompanyFollowListResponse;
import com.tmi.backend.domain.follow.company.dto.response.SimpleCompanyFollow;
import com.tmi.backend.domain.follow.company.entity.CompanyFollow;
import com.tmi.backend.domain.follow.company.repository.CompanyFollowRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.global.common.entity.PageDetail;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
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

  public CompanyFollowListResponse getCompanyFollows(Long followerId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<SimpleCompanyFollow> result = followRepository.findSimpleByFollowerId(followerId,
        pageable);
    PageDetail pageInfo = PageDetail.of(
        result.getTotalElements(),
        result.getTotalPages(),
        result.isLast(),
        result.getNumber()
    );
    return CompanyFollowListResponse.of(result.getContent(), pageInfo);
  }

  @Transactional
  public Long createFollow(CompanyFollowCreateRequest req) {
    Long followerId = req.followerId();
    Long companyId = req.companyId();

    if (followRepository.existsByFollowerIdAndCompanyId(followerId, companyId)) {
      throw new BusinessException(ErrorCode.FOLLOW_ALREADY_FOLLOWING);
    }

    Member follower = memberRepository.findById(followerId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    Company company = companyRepository.findById(companyId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMPANY_NOT_FOUND));

    CompanyFollow cf = CompanyFollow.of(follower, company);
    followRepository.save(cf);
    return cf.getId();
  }

  @Transactional
  public Long deleteFollow(Long companyFollowId) {
    CompanyFollow cf = followRepository.findById(companyFollowId)
        .orElseThrow(() -> new BusinessException(ErrorCode.COMPANY_NOT_FOUND));
    followRepository.delete(cf);
    return companyFollowId;
  }
}
