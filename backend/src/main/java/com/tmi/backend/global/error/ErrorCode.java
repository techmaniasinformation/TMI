package com.tmi.backend.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

  /**
   * USER(A000)
   */
  USER_NOT_EXIST(HttpStatus.NOT_FOUND, "A001", "존재하지 않는 유저입니다"),
  LOGIN_FAIL(HttpStatus.UNAUTHORIZED, "A002", "로그인 도중 오류가 발생했습니다."),
  USER_TOKEN_ALREADY_EXIST(HttpStatus.BAD_REQUEST, "A003", "이미 등록된 USER TOKEN입니다."),
  USER_AUTHORIZATION_NOT_EXIST(HttpStatus.UNAUTHORIZED, "A004", "권한이 없습니다."),

  /**
   * JWT TOKEN(E000)
   */
  TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "E001", "유효하지 않은 토큰입니다."),
  TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "E002", "만료된 토큰입니다."),
  TOKEN_UNSUPPORTED(HttpStatus.UNAUTHORIZED, "E003", "지원되지 않는 토큰입니다."),
  TOKEN_WRONG(HttpStatus.UNAUTHORIZED, "E004", "잘못된 토큰 서명입니다."),
  TOKEN_NOT_EXIST(HttpStatus.UNAUTHORIZED, "E005", "토큰이 존재하지 않습니다."),


  /**
   * BADGE(K000)
   */
  USER_BADGE_NOT_EXIST(HttpStatus.NOT_FOUND, "K001", "존재하지 않는 사용자 뱃지입니다."),
  BADGE_NOT_EXIST(HttpStatus.NOT_FOUND, "K002", "존재하지 않는 뱃지입니다."),

  /**
   * NOTIFICATION(O000)
   */
  NOTIFICATION_NOT_EXIST(HttpStatus.NOT_FOUND, "O001", "존재하지 않는 알림입니다."),

  /**
   * ETC(Z000)
   */
  INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "Z009", "잘못된 파라미터가 포함되었습니다.");

  private final HttpStatus httpStatus;
  private final String code;
  private final String message;
}
