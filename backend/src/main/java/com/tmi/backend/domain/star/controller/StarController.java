package com.tmi.backend.domain.star.controller;

import com.tmi.backend.domain.star.dto.request.StarRegisterRequest;
import com.tmi.backend.domain.star.service.StarService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/star")
@RequiredArgsConstructor
public class StarController {

  private final StarService starService;

  // TODO : 권한 검증 필요
  @PostMapping
  public ApiResponse<?> starRegister(
      @Valid @RequestBody StarRegisterRequest request
  ) {

    return ApiSuccessResponse.success(starService.register(request.memberId(), request.postId()));
  }
}
