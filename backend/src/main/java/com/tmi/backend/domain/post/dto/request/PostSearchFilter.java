package com.tmi.backend.domain.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;

public record PostSearchFilter(
    @NotBlank String q,
    @Size(max = 5) List<Integer> techTags,
    @Size(max = 5) List<Integer> companyTags
) {
}
