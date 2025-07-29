package com.tmi.backend.domain.member.dto.request;

import jakarta.validation.constraints.Size;

public record MemberUpdateRequest(
    @Size(max = 8) String nickname,
    String memberProfileUrl,
    String blogUrl,
    String githubUrl
) {

}
