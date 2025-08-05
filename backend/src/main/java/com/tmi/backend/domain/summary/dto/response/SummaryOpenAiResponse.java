package com.tmi.backend.domain.summary.dto.response;

import java.awt.Choice;
import java.util.List;

public record SummaryOpenAiResponse(
    List<Choice> choices
) {
  public record Choice(Message message) {}
  public record Message(String role, String content) {}
}
