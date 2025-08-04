package com.tmi.backend.domain.commentRecommendation.controller;

import com.tmi.backend.domain.commentRecommendation.dto.request.RecommendationRequest;
import com.tmi.backend.domain.commentRecommendation.dto.response.RecommendationListResponse;
import com.tmi.backend.domain.commentRecommendation.service.CommentRecommendationService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.impl.ApiSuccessResponse;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recommendation")
@RequiredArgsConstructor
public class CommentRecommendationController implements BaseController {

  private final CommentRecommendationService commentRecommendationService;

  // TODO: 권한 검증 필요

  @PostMapping
  public ResponseEntity<ApiResponse<Map<String, Long>>> recommendation(
      @Valid @RequestBody RecommendationRequest request
  ){

    return handle(commentRecommendationService.recommendation(request));
  }

  @DeleteMapping("/{recommendationId}")
  public ResponseEntity<ApiResponse<Void>> recommendationDelete(@PathVariable Long recommendationId) {

    return handle(commentRecommendationService.delete(recommendationId));
  }

  @GetMapping()
  public ResponseEntity<ApiResponse<RecommendationListResponse>> getRecommendations(
      @RequestParam(required = false) Long memberId,
      @RequestParam(required = false) Long postId
  ) {
    return handle(commentRecommendationService.getRecommendations(memberId, postId));
  }
}
