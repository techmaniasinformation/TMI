package com.tmi.backend.domain.auth.oauth.service;

import com.tmi.backend.domain.auth.oauth.util.OAuthUserProcessor;
import com.tmi.backend.domain.member.entity.Provider;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final OAuthUserProcessor processor;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(userRequest);
    Map<String, Object> attrs = oAuth2User.getAttributes();

    Provider provider = Provider.valueOf(
        userRequest.getClientRegistration().getRegistrationId().toUpperCase());
    String providerMemberId = extractProviderMemberId(provider, attrs);

    return processor.process(provider, attrs, providerMemberId, null);
  }

  private String extractProviderMemberId(Provider provider, Map<String, Object> attributes) {
    return switch (provider) {
      case KAKAO -> String.valueOf(attributes.get("id"));
      case NAVER -> {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        yield String.valueOf(response.get("id"));
      }
      default -> null;
    };
  }
}