package com.tmi.backend.domain.member.dto.request;

import com.tmi.backend.domain.member.entity.Provider;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberCreateRequest {

  @NotNull
  private Provider provider;

  @NotBlank
  private String providerMemberId;

  @NotBlank
  @Size(max = 8)
  private String nickname;

  private String memberProfileUrl;
}
