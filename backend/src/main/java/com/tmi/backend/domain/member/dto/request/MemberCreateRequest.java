package com.tmi.backend.domain.member.dto.request;

import com.tmi.backend.domain.member.entity.Provider;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record MemberCreateRequest(
    @NotNull Provider provider,
    @NotBlank @Size(max = 100) String providerMemberId,
    @NotBlank @Size(max = 20) String nickname,
    String memberProfileUrl) {

}
