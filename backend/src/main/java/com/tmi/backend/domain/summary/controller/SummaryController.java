package com.tmi.backend.domain.summary.controller;

import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.domain.summary.service.SummaryService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/summary")
@RequiredArgsConstructor
public class SummaryController implements BaseController {

  private final SummaryService summaryService;

  @PostMapping()
  public ResponseEntity<ApiResponse<SummaryResponse>> extractAndSummarize(@RequestParam String url) {

    String content = summaryService.extractContent(url);
    return handle(summaryService.summarizeWithOpenAI(content));
  }

  @GetMapping("/test")
  public String test(@RequestParam String url) {
    return summaryService.extractContent(url);
  }
}
