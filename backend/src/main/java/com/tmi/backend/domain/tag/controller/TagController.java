package com.tmi.backend.domain.tag.controller;

import com.tmi.backend.domain.tag.dto.request.TagSearchRequest;
import com.tmi.backend.domain.tag.service.TagService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.common.response.impl.ApiErrorResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tag")
@RequiredArgsConstructor
public class TagController implements BaseController {

  private final TagService tagService;

  /**
   * 태그 검색 API
   * @param q 검색어
   */
  @GetMapping
  public ResponseEntity<ApiResponse<TagSearchRequest>> searchTags(@RequestParam(required = false) String q) {

    return handle(tagService.searchTags(q));
  }
}
