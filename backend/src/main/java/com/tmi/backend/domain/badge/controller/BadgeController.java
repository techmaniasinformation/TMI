package com.tmi.backend.domain.badge.controller;

import com.tmi.backend.domain.badge.dto.response.BadgeListResponse;
import com.tmi.backend.domain.badge.service.BadgeService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/badge")
@RequiredArgsConstructor
public class BadgeController implements BaseController {

  private final BadgeService badgeService;

  @GetMapping
  public ResponseEntity<ApiResponse<BadgeListResponse>> getBadges() {
    return handle(badgeService.getAllBadges());
  }
}