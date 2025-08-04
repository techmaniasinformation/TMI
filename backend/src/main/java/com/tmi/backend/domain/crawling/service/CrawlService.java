package com.tmi.backend.domain.crawling.service;

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
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrawlService {

  private final RestTemplate restTemplate = new RestTemplate();

  @Value("${api.gms-key}")
  private String OPENAI_API_KEY;

  public String extractContent(String url) {
    HttpHeaders headers = new HttpHeaders();
    headers.add("User-Agent", "Mozilla/5.0");

    ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    if (response.getStatusCode() != HttpStatus.OK) {
      throw new RuntimeException("크롤링 실패: 상태 코드 " + response.getStatusCode());
    }

    String html = response.getBody();
    Document doc = Jsoup.parse(html);

    // 불필요한 태그 제거
    String[] removeTags = {"script", "style", "noscript", "footer", "header", "nav", "aside"};
    for (String tag : removeTags) {
      doc.select(tag).remove();
    }

    // 가장 긴 텍스트 블록(article, div)
    Elements candidates = doc.select("article, div");
    if (candidates.isEmpty()) {
      throw new RuntimeException("본문 블록을 찾을 수 없습니다.");
    }

    Element mainContent = candidates.stream()
        .max(Comparator.comparingInt(e -> e.text().trim().length()))
        .orElseThrow(() -> new RuntimeException("본문 추출 실패"));

    String cleanedText = Arrays.stream(mainContent.text().split("\n"))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .collect(Collectors.joining("\n"));

    return cleanedText;
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

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(OPENAI_API_KEY);

    HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

    String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    ResponseEntity<String> response = restTemplate.postForEntity(OPENAI_API_URL, request, String.class);
    if (response.getStatusCode() != HttpStatus.OK) {
      throw new RuntimeException("OpenAI 호출 실패: " + response.getStatusCode());
    }

    return response.getBody(); // 필요하면 JSON 파싱해서 요약 내용만 추출 가능
  }
}
