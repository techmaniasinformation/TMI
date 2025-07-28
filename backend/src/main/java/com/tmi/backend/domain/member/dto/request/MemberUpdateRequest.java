package com.tmi.backend.domain.member.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberUpdateRequest {

  @Size(max = 8)
  private String nickname;
  private String memberProfileUrl;
  private String blogUrl;
  private String githubUrl;
}