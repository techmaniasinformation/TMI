package com.tmi.backend.domain.auth.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

  /**
   * 현재 로그인한 사용자의 memberId 추출.
   */
  public static Long getCurrentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    System.out.println(auth.getPrincipal());
    if (auth == null || !auth.isAuthenticated()
        || !(auth.getPrincipal() instanceof CustomUserDetails)) {
      return null;
    }
    return ((CustomUserDetails) auth.getPrincipal()).getMemberId();
  }

  /**
   * 인증객체의 memberId 와 요청시 memberId 비교
   */
  public static boolean memberCheck(Long memberId) {
    Long currentUserId = getCurrentUserId();
    System.out.println(currentUserId);
    if (currentUserId == null || !currentUserId.equals(memberId)) {
      return false;
    }
    return true;
  }
}