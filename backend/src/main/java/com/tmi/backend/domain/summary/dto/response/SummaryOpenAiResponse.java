package com.tmi.backend.domain.summary.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SummaryOpenAiResponse(List<Choice> choices) {

  @JsonIgnoreProperties(ignoreUnknown = true)
  public record Choice(Message message) {

  }

  @JsonIgnoreProperties(ignoreUnknown = true) // 알 수 없는 필드 무시 (e.g., refusal, annotations)
  public record Message(String content, String role) {

  }
}
