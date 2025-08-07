package com.tmi.backend.domain.summary.dto;

import java.util.List;

public record SummaryContent(
    String summary,
    List<String> tags
) {

}
