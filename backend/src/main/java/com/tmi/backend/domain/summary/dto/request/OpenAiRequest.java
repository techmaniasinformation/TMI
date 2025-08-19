package com.tmi.backend.domain.summary.dto.request;


import com.tmi.backend.domain.summary.dto.response.SummaryOpenAiResponse.Message;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record OpenAiRequest(
    String model,
    List<Message> messages
) {

  public static OpenAiRequest from(String content) {
    String prompt = """
        The following is a blog article. Based on its content, respond ONLY in **valid JSON format** according to the conditions below:
        
        1. Summarize the core content of the blog in Korean.
        2. Recommend 1 to 5 relevant tags based on the content.
        3. Respond strictly in the following JSON format. Do not include any explanations, code fences, or extra text.
        
        {
          "summary": "Summarized content",
          "tags": ["tag1", "tag2", "tag3"]
        }
        
        Additional instructions:
        - The summary length should be proportional to the original text length:
          - For short articles, 2–3 sentences.
          - For medium-length articles, 7-10 sentences.
          - For very long articles, provide more detail, but never exceed 30% of the original content size.
        - Keep the summary concise and natural.
        - The tags should be meaningful keywords that best represent the topic, theme, or domain of the article.
        - Do not include hashtags (#) or any formatting symbols in tags.
        - Do not generate tags that are too generic (e.g., "blog", "article", "general").
        
        Blog content:
        """;

    List<Message> messages = List.of(
        new Message("You are a helpful assistant that summarizes content and recommends tags.",
            "system"
        ),
        new Message(prompt + "\n\n" + content, "user")
    );

    return new OpenAiRequest("gpt-4o", messages);
  }

  public record ResponseFormat(String type) {

  }
}
