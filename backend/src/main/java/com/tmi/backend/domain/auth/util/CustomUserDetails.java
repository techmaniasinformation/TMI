package com.tmi.backend.domain.auth.util;

import com.tmi.backend.domain.member.entity.Member;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class CustomUserDetails implements UserDetails {

  private final Long memberId;
  private final Collection<? extends GrantedAuthority> authorities;

  public CustomUserDetails(Member member) {
    this.memberId = member.getId();
    // 모든 사용자에게 ROLE_USER만
    this.authorities = List.of(() -> "ROLE_USER");
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  // JWT 인증이라 비밀번호 불필요
  @Override
  public String getPassword() {
    return "";
  }

  @Override
  public String getUsername() {
    return memberId.toString();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

}