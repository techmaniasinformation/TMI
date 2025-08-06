package com.tmi.backend.domain.badge.service;

import com.tmi.backend.domain.badge.dto.response.BadgeListResponse;
import com.tmi.backend.domain.badge.dto.response.SimpleBadge;
import com.tmi.backend.domain.badge.entity.Badge;
import com.tmi.backend.domain.badge.repository.BadgeRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BadgeService {

  private final BadgeRepository badgeRepository;

  public ServiceResult<BadgeListResponse> getAllBadges() {
    List<Badge> badges = badgeRepository.findAll();
    return ServiceResult.ok(BadgeListResponse.from(SimpleBadge.from(badges)));
  }

}