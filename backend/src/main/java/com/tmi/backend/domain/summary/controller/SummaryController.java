package com.tmi.backend.domain.summary.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.domain.summary.service.SummaryService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/summary")
@RequiredArgsConstructor
public class SummaryController implements BaseController {

  private final SummaryService summaryService;

  @PostMapping()
  public ResponseEntity<ApiResponse<SummaryResponse>> extractAndSummarize(@RequestParam String url)
      throws JsonProcessingException {
    ServiceResult<String> extractResult = summaryService.extractContent(url);

    if (!extractResult.success()) {
      return handle(ServiceResult.fail(extractResult.code()));
    }

    // 3. 추출에 성공한 경우에만, 요약을 진행합니다.
    String content = extractResult.data();
    return handle(summaryService.summarize(content));
  }
}
