package com.tmi.backend.domain.summary;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.service.tool.ToolExecutionResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebBrowserTool {

  private final McpClient mcpClient;

  @Tool("이 도구는 URL에 접속하여 본문 텍스트만 정제해서 반환합니다.")
  public String browseAndClean(String url) {
    StopWatch sw = new StopWatch("WebBrowserTool");
    // 1. 실행할 최적화된 Playwright 코드 작성
    String optimizedCode = String.format("""
        async (page) => {
            // 리소스 차단으로 속도 최적화
            await page.route('**/*', r => ['image','font','stylesheet'].includes(r.request().resourceType()) ? r.abort() : r.continue());
            await page.goto('%s', { waitUntil: 'domcontentloaded', timeout: 15000 });
        
            let root = page;
            const frameEl = await page.$('#mainFrame');
            if (frameEl) {
                const frm = await frameEl.contentFrame();
                if (frm) root = frm;
            }
        
            const selectors = ['article', 'main', '.article-view', '.se-main-container', '#content', 'body'];
            for (const sel of selectors) {
                const el = await root.$(sel);
                if (el) {
                    const text = await el.innerText();
                    if (text && text.trim().length > 200) return text.trim();
                }
            }
            return "";
        }
        """, url);
    sw.start("MCP_Playwright_Execution");
    ToolExecutionRequest request = ToolExecutionRequest.builder()
        .name("browser_run_code")
        .arguments(String.format("{\"code\": \"%s\"}", escapeJson(optimizedCode)))
        .build();

    // 3. MCP 서버에 직접 실행 요청
    ToolExecutionResult result = mcpClient.executeTool(request);
    sw.stop();
    sw.start("Java_Parsing_And_Cleaning");
    String cleanedText = parseOnlyResult(result.resultText());
    sw.stop();
    log.info("Raw result length from MCP Playwright tool: {}", result.resultText().length());
    log.info("clean result length from MCP Playwright tool: {}", cleanedText.length());

    log.info("\n{}", sw.prettyPrint()); // 단계별 소요 시간 출력
    return cleanedText;
  }

  private String parseOnlyResult(String raw) {
    if (raw == null || !raw.contains("### Result")) {
      return raw;
    }

    // "### Result" 이후부터 "###" 이전까지만 잘라내어 에러 로그와 실행 코드를 버림
    String content = raw.split("### Result")[1];
    if (content.contains("###")) {
      content = content.split("###")[0];
    }
    return content.trim();
  }

  private String escapeJson(String input) {
    return input.replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", "\\n")
        .replace("\r", "\\r");
  }
}