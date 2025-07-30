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
    // 소셜 서버로부터 사용자 정보를 받아와서 OAuth2User로 변환
    OAuth2User oAuth2User = super.loadUser(userRequest);

    // 어떤 소셜 로그인인지 (kakao, google 등)
    Provider provider = Provider.valueOf(
        userRequest.getClientRegistration().getRegistrationId().toUpperCase());

    // 소셜에서 제공한 데이터.
    Map<String, Object> attributes = oAuth2User.getAttributes();

    // 소셜의 고유 사용자 ID 추출
    String providerMemberId = extractProviderMemberId(provider, attributes);

    // 기존 회원 조회
    Optional<Member> optionalMember = memberRepository.findByProviderAndProviderMemberId(
        provider, providerMemberId
    );

    //회원 정보가 있는 경우.
    if (optionalMember.isPresent()) {
      Member member = optionalMember.get();

      //탈퇴한 회원인경우
      if (member.getDeletedAt() != null) {
        LocalDateTime deletedAt = member.getDeletedAt();
        LocalDateTime now = LocalDateTime.now();

        // 7일 이내 재가입 불가
        if (deletedAt.plusDays(7).isAfter(now)) {
          throw new OAuth2AuthenticationException("탈퇴한 회원입니다. 7일 후 재가입이 가능합니다.");

          // 7일 이후 재가입 가능
        } else {
          return new CustomOAuth2User(
              null,
              provider,
              providerMemberId,
              attributes,
              true
          );
        }
      }

      // 기존 회원 로그인 처리
      return new CustomOAuth2User(
          member.getId(),
          provider,
          providerMemberId,
          attributes,
          false
      );
    }

    // 회원정보 없는 경우
    return new CustomOAuth2User(
        null,
        provider,
        providerMemberId,
        attributes,
        true // 신규 회원
    );

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