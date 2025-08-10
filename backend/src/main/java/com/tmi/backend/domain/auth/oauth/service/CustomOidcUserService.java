package com.tmi.backend.domain.auth.oauth.service;

import com.tmi.backend.domain.auth.oauth.util.OAuthUserProcessor;
import com.tmi.backend.domain.member.entity.Provider;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

  private final OAuthUserProcessor processor;

  @Override
  public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
    OidcUser oidcUser = super.loadUser(userRequest);
    Map<String, Object> attrs = oidcUser.getAttributes();

    Provider provider = Provider.valueOf(
        userRequest.getClientRegistration().getRegistrationId().toUpperCase());
    String providerMemberId = extractProviderMemberId(provider, attrs);

    return processor.process(provider, attrs, providerMemberId, oidcUser);
  }

  private String extractProviderMemberId(Provider provider, Map<String, Object> attributes) {
    return switch (provider) {
      case GOOGLE -> (String) attributes.get("sub");
      default -> null;
    };
  }
}

