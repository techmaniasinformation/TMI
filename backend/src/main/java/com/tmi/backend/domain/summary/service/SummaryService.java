package com.tmi.backend.domain.summary.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.domain.summary.dto.SummaryContent;
import com.tmi.backend.domain.summary.dto.request.OpenAiRequest;
import com.tmi.backend.domain.summary.dto.response.SummaryOpenAiResponse;
import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SummaryService {

  private final RestClient restClient = RestClient.create();
  private final RestClient openAiRestClient;

  // SummaryService.java
  public ServiceResult<String> extractContent(String url) {
    String html;
    try {
      html = restClient.get().uri(url).header("User-Agent", "Mozilla/5.0").retrieve()
          .onStatus(status -> !status.is2xxSuccessful(), (req, res) -> {
            throw new RuntimeException("크롤링 실패: 상태 코드 " + res.getStatusCode());
          }).body(String.class);

      if (html == null || html.isBlank()) {
        return ServiceResult.fail(ErrorCode.CRAWLING_FAILED);
      }

      Document doc = Jsoup.parse(html);

      String[] removeTags = {"script", "style", "noscript", "footer", "header", "nav", "aside"};
      for (String tag : removeTags) {
        doc.select(tag).remove();
      }

      Elements candidates = doc.select("article, div");
      if (candidates.isEmpty()) {
        return ServiceResult.fail(ErrorCode.CONTENT_EXTRACTION_FAILED);
      }

      Element mainContent = candidates.stream()
          .max(Comparator.comparingInt(e -> e.text().trim().length()))
          .orElse(null);

      String resultText = Arrays.stream(mainContent.text().split("\n"))
          .map(String::trim)
          .filter(s -> !s.isEmpty())
          .collect(Collectors.joining("\n"));

      return ServiceResult.ok(resultText);

    } catch (Exception e) {
      return ServiceResult.fail(ErrorCode.CRAWLING_FAILED);
    }
  }

  public ServiceResult<SummaryResponse> summarize(String content)
      throws JsonProcessingException {
    OpenAiRequest requestBody = OpenAiRequest.from(content); // 직접만든 DTO

    ObjectMapper objectMapper = new ObjectMapper();
    String json = objectMapper.writeValueAsString(requestBody); // requestBody → JSON
    String customBody = openAiRestClient
        .post()
        .uri("/v1/chat/completions")
        .body(json) // O
//      .body(requestBody) // X 요청 본문은 DTO가 아닌 String으로
        .retrieve()
        .onStatus(status -> !status.is2xxSuccessful(), (req, res) -> {
          throw new RuntimeException("OpenAI 호출 실패: " + res.getStatusCode());
        })
        .body(String.class);

    try {
      SummaryOpenAiResponse parsed = objectMapper.readValue(customBody,
          SummaryOpenAiResponse.class);

      String contentJson = parsed.choices().get(0).message().content();
      SummaryContent tempContent = objectMapper.readValue(contentJson, SummaryContent.class);
      String summary = tempContent.summary();
      List<String> tags = tempContent.tags();
      SummaryResponse result = SummaryResponse.of(summary, tags);
      return ServiceResult.ok(result);
    } catch (Exception e) {
      return ServiceResult.fail(ErrorCode.COMMON_INTERNAL_ERROR);
    }
  }
}