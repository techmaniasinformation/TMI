package com.tmi.backend.global.config;

import com.tmi.backend.domain.summary.WebBrowserTool;
import com.tmi.backend.domain.summary.service.SummaryAgent;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.stdio.StdioMcpTransport;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiLLMConfig {

  @Value("${api.gemini-api-key}")
  private String geminiApiKey;

  @Value("${api.openai-api-key}")
  private String openAiApiKey;

  @Bean
  public ChatModel geminiModel() {
    return GoogleAiGeminiChatModel.builder()
        .apiKey(geminiApiKey)
        // https://github.com/langchain4j/langchain4j/blob/main/docs/docs/integrations/language-models/google-ai-gemini.md#models-available
        // 사용 가능 모델 readme
        .modelName("gemini-2.5-flash") // 속도가 빠른 모델 사용
        .logRequests(true)
        .logResponses(true)
        .build();
  }

  @Bean
  public ChatModel openAiModel() {
    return OpenAiChatModel.builder()
        .apiKey(openAiApiKey)
        .modelName("gpt-5-nano")
        .logRequests(true)
        .build();
  }

  @Bean
  public McpClient mcpClient() {
//    List<String> command = List.of(
//        "docker", "exec", "-i", "mcp-server",
//        "playwright-mcp", "--browser", "chromium", "--no-sandbox"
//    );

    List<String> command = List.of(
        "docker", "run",
        "-i",              // 표준 입출력 유지
        "--rm",            // 종료 시 컨테이너 삭제
        "--init",          // 좀비 프로세스 방지
        "mcr.microsoft.com/playwright/mcp" // 공식 이미지 사용
    );
    return new DefaultMcpClient.Builder()
        .transport(new StdioMcpTransport.Builder()
            .command(command)
            .logEvents(true)
            .build())
        .build();
  }

  @Bean
  public SummaryAgent summaryAgent(ChatModel openAiModel, WebBrowserTool webBrowserTool) {
    return AiServices.builder(SummaryAgent.class)
        .chatModel(openAiModel)
        .tools(webBrowserTool)
        .build();
  }
}