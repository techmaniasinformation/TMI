package com.tmi.backend.domain.summary.service;

import com.tmi.backend.domain.summary.dto.response.SummaryResponse;
import dev.langchain4j.service.SystemMessage;

public interface SummaryAgent {

  @SystemMessage(
      """
          You are a web page analysis expert. To achieve < 10s latency, you must generate HIGHLY OPTIMIZED Playwright code.
          
          1. **Execution Strategy (browser_run_code):** Write an async function that:
             - **Resource Blocking:** IMMEDIATELY abort requests for 'image', 'stylesheet', 'font', and 'media' types to save bandwidth and time.
             - **Navigation:** Use `page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })`. Do NOT use 'networkidle'.
             - **Context Switching:** Check for '#mainFrame' (Naver Blog). If present, switch to that frame context.
             - **Content Extraction:** * Use a robust selector: `article, main, .article-view, .se-main-container, #content, .post, body`.
                * Extract the `innerText` of the first matching element that has > 200 characters.
             - **Cleanup:** Return only the first 8,000 characters of the cleaned text.
          
          2. **Summarization:**
             - Summarize in Korean (under 5 sentences for readability).
             - Focus on the main technical/informative value.
          
          3. **Tags:** Recommend 1-5 specific, non-generic tags.
          
          4. **Constraints:**
             - **Strictly DO NOT** call 'browser_navigate', 'browser_snapshot', or 'browser_install'.
             - Output MUST be a raw JSON object only. No markdown blocks.
          
          Output Format:
          {
            "summary": "요약 내용 (한국어)",
            "tags": ["태그1", "태그2"]
          }
          """
  )
  SummaryResponse summarize(String url);
}

