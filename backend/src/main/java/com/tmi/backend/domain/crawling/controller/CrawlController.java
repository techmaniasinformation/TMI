package com.tmi.backend.domain.crawling.controller;

import com.tmi.backend.domain.crawling.service.CrawlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/crawl")
@RequiredArgsConstructor
public class CrawlController {

  private final CrawlService crawlService;

  @GetMapping("/extract")
  public ResponseEntity<String> extractAndSummarize(@RequestParam String url) {
    try {
      String content = crawlService.extractContent(url);
      String summary = crawlService.summarizeWithOpenAI(content);
      return ResponseEntity.ok(summary);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("처리 실패: " + e.getMessage());
    }
  }
}
