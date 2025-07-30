package com.tmi.backend.global.oauth;

import com.tmi.backend.domain.member.entity.Provider;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Getter
@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {

  private final Long memberId;                   // 우리 서비스의 고유 ID
  private final Provider provider;               // kakao, google, naver
  private final String providerMemberId;         // 소셜 서비스의 고유 사용자 ID
  private final Map<String, Object> attributes;  // 원본 사용자 정보
  private final boolean newUser;                 // 회원가입 여부


  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
  }

  @Override
  public String getName() {
    // Security에서 고유 ID로 사용됨
    //TODO : 고민해보기
    return String.valueOf(provider) + "_" + providerMemberId;
  }

}
