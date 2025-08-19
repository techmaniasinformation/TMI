package com.tmi.backend.domain.auth.oauth.util;

import com.tmi.backend.domain.member.entity.Provider;
import com.tmi.backend.domain.member.repository.MemberRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class OAuthUserProcessor {

  protected final MemberRepository memberRepository;

  public CustomOauthUser process(
      Provider provider,
      Map<String, Object> attrs,
      String providerMemberId,
      OidcUser oidcUser
  ) {
    return memberRepository.findByProviderAndProviderMemberId(provider, providerMemberId)
        .map(m -> {
          // 기존 회원
          if (m.getDeletedAt() == null) {
            return new CustomOauthUser(m.getId(), provider, providerMemberId, attrs, false,
                oidcUser);
          }

          // 탈퇴한지 7일 이상 경과되지 않은 회원
          if (m.getDeletedAt().plusDays(7).isAfter(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new OAuth2AuthenticationException("탈퇴한 회원입니다.");
          }

          //탈퇴한지 7일 이상 경과된 회원
          return new CustomOauthUser(null, provider, providerMemberId, attrs, true,
              oidcUser);
        })

        // 신규 회원
        .orElseGet(() -> new CustomOauthUser(null, provider, providerMemberId, attrs, true,
            oidcUser));
  }
}
