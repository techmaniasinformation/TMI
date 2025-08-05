package com.tmi.backend.domain.summary.dto.response;

import com.tmi.backend.domain.tag.entity.Tag;
import java.util.List;

public record SummaryResponse (
    String summary,
    List<Tag> tags
) {
}
