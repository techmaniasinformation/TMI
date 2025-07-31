package com.tmi.backend.global.oauth;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.entity.Provider;
import com.tmi.backend.domain.member.repository.MemberRepository;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
  private final MemberRepository memberRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(userRequest);
    Provider provider = Provider.valueOf(
        userRequest.getClientRegistration().getRegistrationId().toUpperCase());
    Map<String, Object> attrs = oAuth2User.getAttributes();
    String providerMemberId = extractProviderMemberId(provider, attrs);

    // 1) 삭제여부 상관없이 무조건 조회
    Optional<Member> opt = memberRepository
        .findByProviderAndProviderMemberId(provider, providerMemberId);

    if (opt.isPresent()) {
      Member m = opt.get();

      // 2‑1) 정상 회원
      if (m.getDeletedAt() == null) {
        return new CustomOAuth2User(
            m.getId(), provider, providerMemberId, attrs, false);
      }

      // 2‑2) soft‑delete 된 회원
      LocalDateTime deletedAt = m.getDeletedAt();
      if (deletedAt.plusDays(7).isAfter(LocalDateTime.now())) {
        // 7일 이내면 예외
        throw new OAuth2AuthenticationException(
            "탈퇴한 회원입니다. 7일 후 재가입이 가능합니다");
      } else {
        // 7일 지났으면 신규 회원처럼 처리
        return new CustomOAuth2User(
            null, provider, providerMemberId, attrs, true);
      }
    }

    // 3) 조회된 회원이 없으면 → 신규 회원
    return new CustomOAuth2User(
        null, provider, providerMemberId, attrs, true);
  }


  /**
   * 각 provider별로 사용자 고유 ID 추출
   */
  private String extractProviderMemberId(Provider provider, Map<String, Object> attributes) {
    return switch (provider) {
      case KAKAO -> String.valueOf(attributes.get("id"));
      case NAVER -> {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        yield String.valueOf(response.get("id"));
      }
      case GOOGLE -> String.valueOf(attributes.get("sub"));
      case ADMIN -> null;
    };
  }
}