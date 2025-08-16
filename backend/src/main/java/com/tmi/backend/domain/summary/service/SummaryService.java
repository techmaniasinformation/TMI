package com.tmi.backend.domain.summary.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tmi.backend.domain.summary.dto.SummaryContent;
import com.tmi.backend.domain.summary.dto.request.OpenAiRequest;
import com.tmi.backend.domain.summary.dto.response.SummaryOpenAiResponse;
import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.component.WebDriverPool;
import com.tmi.backend.global.error.ErrorCode;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLHandshakeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SummaryService {

  private final RestClient restClient = RestClient.create();
  private final RestClient openAiRestClient;
  private final WebDriverPool webDriverPool;

  public ServiceResult<String> extractContent(String url) {
    try {
      String html = fetchHtml(url);

      Document doc = Jsoup.parse(html);
      removeUnwantedTags(doc);

      ServiceResult<String> jsoupResult = extractWithJsoup(doc);
      if (jsoupResult.success()) {
        return jsoupResult;
      }
      ServiceResult<String> seleniumResult = extractWithSeleniumIfNeeded(doc, url);
      if (seleniumResult.success()) {
        return seleniumResult;
      }
      return ServiceResult.fail(ErrorCode.CONTENT_EXTRACTION_FAILED);
    } catch (Exception e) {
      log.error("SummaryService : Exception : {}", e.getMessage());
      return ServiceResult.fail(ErrorCode.CRAWLING_FAILED);
    }
  }

  private String fetchHtml(String url) {
    return restClient.get()
        .uri(url)
        .header("User-Agent", "Mozilla/5.0")
        .retrieve()
        .onStatus(status -> !status.is2xxSuccessful(),
            (req, res) -> {
              throw new RuntimeException("크롤링 실패: " + res.getStatusCode());
            })
        .body(String.class);
  }

  private void removeUnwantedTags(Document doc) {
    String[] removeTags = {"script", "style", "noscript", "footer", "header", "nav", "aside"};
    for (String tag : removeTags) {
      doc.select(tag).remove();
    }
  }

  private ServiceResult<String> extractWithJsoup(Document doc) {
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
  }

  private ServiceResult<String> extractWithSeleniumIfNeeded(Document doc, String url) {
    Elements iframes = doc.select("iframe");
    if (iframes.isEmpty()) {
      return ServiceResult.fail(ErrorCode.CONTENT_EXTRACTION_FAILED);
    }

    WebDriver driver = null;
    try {
      driver = webDriverPool.borrowDriver();
      driver.get(url);

      for (WebElement iframe : driver.findElements(By.tagName("iframe"))) {
        driver.switchTo().frame(iframe);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement content = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.cssSelector("article, div")));

        if (content != null) {
          return ServiceResult.ok(content.getText());
        }

        driver.switchTo().defaultContent();
      }

    } catch (Exception e) {
      return ServiceResult.fail(ErrorCode.CONTENT_EXTRACTION_FAILED);
    } finally {
      if (driver != null) {
        webDriverPool.returnDriver(driver);
      }
    }

    return ServiceResult.fail(ErrorCode.CONTENT_EXTRACTION_FAILED);
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

  private ServiceResult<String> handleCrawlingException(Exception e) {
    if (e instanceof SSLHandshakeException || e instanceof SSLException) {
      return ServiceResult.fail(ErrorCode.SSL_ERROR);
    } else if (e instanceof UnknownHostException) {
      return ServiceResult.fail(ErrorCode.UNKNOWN_HOST);
    } else if (e instanceof SocketTimeoutException) {
      return ServiceResult.fail(ErrorCode.TIMEOUT);
    } else if (e instanceof HttpClientErrorException) {
      return ServiceResult.fail(ErrorCode.HTTP_CLIENT_ERROR);
    } else if (e instanceof HttpServerErrorException) {
      return ServiceResult.fail(ErrorCode.HTTP_SERVER_ERROR);
    } else if (e instanceof WebDriverException) {
      return ServiceResult.fail(ErrorCode.SELENIUM_ERROR);
    } else if (e instanceof IOException) {
      return ServiceResult.fail(ErrorCode.NETWORK_ERROR);
    } else {
      return ServiceResult.fail(ErrorCode.CRAWLING_FAILED);
    }
  }
}