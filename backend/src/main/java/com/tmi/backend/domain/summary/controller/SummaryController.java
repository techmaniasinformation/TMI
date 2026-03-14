package com.tmi.backend.domain.summary.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tmi.backend.domain.summary.dto.request.SummaryRequest;
import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.domain.summary.service.AiSummaryService;
import com.tmi.backend.domain.summary.service.SummaryService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StopWatch;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/summary")
@RequiredArgsConstructor
public class SummaryController implements BaseController {

  private final SummaryService summaryService;
  private final AiSummaryService aiSummaryService;

  /**
   * [기존 방식] 수동 크롤링(Jsoup/Selenium) + AI 요약
   */
  @PostMapping()
  public ResponseEntity<ApiResponse<SummaryResponse>> extractAndSummarize(
      @RequestBody SummaryRequest request)
      throws JsonProcessingException {

    StopWatch stopWatch = new StopWatch("Manual System");
    stopWatch.start();

    log.info("기존 방식 시작 - URL: {}", request.url());

    ServiceResult<String> extractResult = summaryService.extractContent(request.url());

    if (!extractResult.success()) {
      return handle(ServiceResult.fail(extractResult.code()));
    }

    String content = extractResult.data();
    ResponseEntity<ApiResponse<SummaryResponse>> response = handle(
        summaryService.summarize(content));

    stopWatch.stop(); // 측정 종료
    log.info("기존 방식 완료! 소요 시간: {} ms", stopWatch.getTotalTimeMillis());

    return response;
  }

  @PostMapping("/ai")
  public ResponseEntity<ApiResponse<SummaryResponse>> summarizeWithAi(
      @RequestBody SummaryRequest request) {

    StopWatch stopWatch = new StopWatch("AI Agent System");
    stopWatch.start(); // 측정 시작

    log.info("AI 에이전트 방식 시작 - URL: {}", request.url());

    ServiceResult<SummaryResponse> result = aiSummaryService.getAiSummary(request.url());

    stopWatch.stop(); // 측정 종료
    log.info("AI 에이전트 방식 완료! 소요 시간: {} ms", stopWatch.getTotalTimeMillis());

    return handle(result);
  }
}