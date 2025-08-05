package com.tmi.backend.domain.summary.service;

import java.util.Comparator;
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

  public String summarizeWithOpenAI(String content) {
    String prompt = "다음 HTML 본문을 요약해줘:";
    String requestBody = """
            {
              "model": "gpt-4",
              "messages": [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": "%s\\n\\n%s" }
              ],
              "temperature": 0.7
            }
            """.formatted(prompt, content.replace("\"", "\\\""));

    String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    return restClient.post()
        .uri(OPENAI_API_URL)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + OPENAI_API_KEY)
        .contentType(MediaType.APPLICATION_JSON)
        .body(requestBody)
        .retrieve()
        .onStatus(status -> !status.is2xxSuccessful(), (req, res) -> {
          throw new RuntimeException("OpenAI 호출 실패: " + res.getStatusCode());
        })
        .body(String.class); // 필요 시 JSON 파싱하여 요약 내용만 추출
  }
}
