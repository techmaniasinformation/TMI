package com.tmi.backend.domain.auth.service;

import com.tmi.backend.domain.auth.util.CustomUserDetails;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final MemberRepository memberRepository;

  //username = Spring Security가 내부적으로 인가(Authorization) 등을 위해 조회하는 “사용자 이름” 역할
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Long memberId = Long.valueOf(username);
    return memberRepository.findById(memberId)
        .map(CustomUserDetails::new)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
  }
}