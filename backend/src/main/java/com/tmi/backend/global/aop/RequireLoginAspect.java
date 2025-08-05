package com.tmi.backend.global.aop;

import com.tmi.backend.global.error.ErrorCode;
import com.tmi.backend.global.error.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class RequireLoginAspect {

  /**
   * 권한 검증
   * @Before(@annotation(...))해당 어노테이션이 붙은 메서드가 실행되기 전에 aop로직 실행
   */
  @Before("@annotation(com.tmi.backend.global.aop.RequireLogin)")
  public void checkLogin(JoinPoint joinPoint) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || auth instanceof AnonymousAuthenticationToken) {
      throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN);  // "로그인이 필요한 요청입니다"
    }

  }
}
