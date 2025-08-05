package com.tmi.backend.domain.summary.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.domain.summary.dto.response.SummaryOpenAiResponse;
import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SummaryService {

  @Value("${api.gms-key}")
  private String OPENAI_API_KEY;
  private final RestClient restClient = RestClient.create();

  public String extractContent(String url) {
    String html = restClient.get()
        .uri(url)
        .header("User-Agent", "Mozilla/5.0")
        .retrieve()
        .onStatus(status -> !status.is2xxSuccessful(), (req, res) -> {
          throw new RuntimeException("크롤링 실패: 상태 코드 " + res.getStatusCode());
        })
        .body(String.class);

    Document doc = Jsoup.parse(html);

    // 불필요한 태그 제거
    String[] removeTags = {"script", "style", "noscript", "footer", "header", "nav", "aside"};
    for (String tag : removeTags) {
      doc.select(tag).remove();
    }

    Elements candidates = doc.select("article, div");
    if (candidates.isEmpty()) {
      throw new RuntimeException("본문 블록을 찾을 수 없습니다.");
    }

    Element mainContent = candidates.stream()
        .max(Comparator.comparingInt(e -> e.text().trim().length()))
        .orElseThrow(() -> new RuntimeException("본문 추출 실패"));

    return Arrays.stream(mainContent.text().split("\n"))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .collect(Collectors.joining("\n"));
  }

  public ServiceResult<SummaryResponse> summarizeWithOpenAI(String content) {
    String prompt = """
        다음은 블로그 본문입니다. 이 내용을 바탕으로 아래 조건을 만족하며 JSON 형태로 응답해 주세요.
        
        1. 글의 핵심 내용을 한글로 요약해 주세요.
        2. 본문 내용을 기반으로 적절한 태그를 1개 이상 5개 이하 추천해 주세요.
        3. 다음과 같은 JSON 형식으로만 응답해 주세요. 여기에 설명이나 부가 문장은 포함하지 마세요.
        
        {
          "summary": "요약 내용",
          "tags": ["태그1", "태그2", "태그3"]
        }
        
        블로그 본문:
        """;

    String requestBody = """
        {
          "model": "gpt-4o",
          "messages": [
            { "role": "system", "content": "당신은 콘텐츠를 요약하고 태그를 추천하는 유용한 도우미입니다." },
            { "role": "user", "content": "%s\\n\\n%s" }
          ],
          "temperature": 0.7
        }
        """.formatted(prompt.replace("\"", "\\\""), content.replace("\"", "\\\""));

    String OPENAI_API_URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions";

    String responseBody = restClient.post()
        .uri(OPENAI_API_URL)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + OPENAI_API_KEY)
        .contentType(MediaType.APPLICATION_JSON)
        .body(requestBody)
        .retrieve()
        .onStatus(status -> !status.is2xxSuccessful(), (req, res) -> {
          throw new RuntimeException("OpenAI 호출 실패: " + res.getStatusCode());
        })
        .body(String.class);

    try {
      ObjectMapper objectMapper = new ObjectMapper();
      SummaryOpenAiResponse parsed = objectMapper.readValue(responseBody,
          SummaryOpenAiResponse.class);
      String summary = parsed.choices().get(0).message().content();

      SummaryResponse result = new SummaryResponse(summary, List.of());
      return ServiceResult.ok(result);
    } catch (Exception e) {
      return ServiceResult.fail(ErrorCode.COMMON_INTERNAL_ERROR);
    }
  }
}
