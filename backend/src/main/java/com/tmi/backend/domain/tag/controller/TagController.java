package com.tmi.backend.domain.tag.controller;

import com.tmi.backend.domain.tag.dto.request.TagSearchRequest;
import com.tmi.backend.domain.tag.service.TagService;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tag")
@RequiredArgsConstructor
public class TagController {

  private final TagService tagService;

  @GetMapping
  public ApiResponse<TagSearchRequest> searchTags(@RequestParam String q) {

    return ApiSuccessResponse.success(tagService.searchTags(q));
  }
}
