package com.tmi.backend.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

  /* 1. COMMON – 공통 */
  COMMON_MISSING_PARAMETER     (HttpStatus.BAD_REQUEST,           "COMMON-001", "필수 입력값이 누락되었습니다"),
  COMMON_INVALID_FORMAT        (HttpStatus.BAD_REQUEST,           "COMMON-002", "요청 형식이 잘못되었습니다"),
  COMMON_INTERNAL_ERROR        (HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-003", "서버 내부 오류입니다"),
  COMMON_SERVICE_UNAVAILABLE   (HttpStatus.SERVICE_UNAVAILABLE,   "COMMON-004", "일시적으로 서비스를 이용할 수 없습니다"),

  /* 2. AUTH – 인증/인가 */
  AUTH_INVALID_TOKEN           (HttpStatus.UNAUTHORIZED,          "AUTH-001",   "토큰이 유효하지 않습니다"),
  AUTH_REQUIRED                (HttpStatus.UNAUTHORIZED,          "AUTH-002",   "인증 정보가 필요합니다"),
  AUTH_ACCESS_DENIED           (HttpStatus.FORBIDDEN,             "AUTH-003",   "접근 권한이 없습니다"),
  AUTH_DUPLICATE_ACCOUNT       (HttpStatus.CONFLICT,              "AUTH-004",   "이미 가입된 계정입니다"),
  AUTH_TOKEN_EXPIRED           (HttpStatus.UNAUTHORIZED,          "AUTH-005",   "만료된 토큰입니다."),

  /* 3. USER – 사용자 */
  USER_NOT_FOUND               (HttpStatus.NOT_FOUND,             "USER-001",   "사용자를 찾을 수 없습니다"),
  USER_DUPLICATE_NICKNAME      (HttpStatus.CONFLICT,              "USER-002",   "중복된 닉네임입니다"),
  USER_NICKNAME_CHANGE_LIMITED (HttpStatus.FORBIDDEN,             "USER-004",   "닉네임 변경은 한 달에 한 번만 가능합니다"),
  USER_RE_REGISTRATION_FORBIDDEN(HttpStatus.FORBIDDEN,            "USER-005",   "재가입은 탈퇴 후 7일 이후 가능합니다"),
  USER_LOGIN_FAIL              (HttpStatus.UNAUTHORIZED,          "USER-006",   "로그인 도중 오류가 발생했습니다."),

  /* 4. POST – 게시글 */
  POST_NOT_FOUND               (HttpStatus.NOT_FOUND,             "POST-001",   "게시글을 찾을 수 없습니다"),
  POST_AI_SUMMARY_FAILED       (HttpStatus.BAD_REQUEST,           "POST-002",   "AI 요약을 수행할 수 없습니다"),
  POST_INVALID_LINK            (HttpStatus.BAD_REQUEST,           "POST-003",   "게시글 링크가 유효하지 않습니다"),
  POST_CONTENT_TOO_LONG        (HttpStatus.PAYLOAD_TOO_LARGE,     "POST-004",   "본문 길이가 너무 깁니다"),

  /* 5. COMMENT – 댓글 */
  COMMENT_NOT_FOUND            (HttpStatus.NOT_FOUND,             "COMMENT-001","댓글을 찾을 수 없습니다"),
  COMMENT_PERMISSION_DENIED    (HttpStatus.FORBIDDEN,             "COMMENT-002","댓글 수정/삭제 권한이 없습니다"),
  COMMENT_CONTENT_REQUIRED     (HttpStatus.BAD_REQUEST,           "COMMENT-003","댓글 내용은 필수입니다"),

  /* 6. FOLLOW – 팔로우 */
  FOLLOW_TARGET_NOT_FOUND      (HttpStatus.NOT_FOUND,             "FOLLOW-001", "팔로우 대상이 존재하지 않습니다"),
  FOLLOW_ALREADY_FOLLOWING     (HttpStatus.CONFLICT,              "FOLLOW-002", "이미 팔로우한 대상입니다"),
  FOLLOW_INVALID_REQUEST       (HttpStatus.BAD_REQUEST,           "FOLLOW-003", "팔로우 요청이 잘못되었습니다"),

  /* 7. STAR – 즐겨찾기 */
  STAR_NOT_FOUND               (HttpStatus.NOT_FOUND,             "STAR-001",   "스타 대상 게시글이 없습니다"),
  STAR_ALREADY_STARRED         (HttpStatus.CONFLICT,              "STAR-002",   "이미 스타를 누른 게시글입니다"),

  /* 8. RECOMMEND – 댓글 추천 */
  RECOMMEND_NOT_FOUND          (HttpStatus.NOT_FOUND,             "RECOMMEND-001", "추천할 댓글을 찾을 수 없습니다"),
  RECOMMEND_ALREADY_RECOMMENDED(HttpStatus.CONFLICT,              "RECOMMEND-002", "이미 추천한 댓글입니다"),

  /* 9. TAG – 태그 및 검색 */
  TAG_LIMIT_EXCEEDED           (HttpStatus.BAD_REQUEST,           "TAG-001",    "태그는 최대 5개까지 설정할 수 있습니다"),
  TAG_NOT_FOUND                (HttpStatus.BAD_REQUEST,           "TAG-002",    "입력한 태그는 존재하지 않습니다"),

  /* 10. SEARCH – 검색 */
  SEARCH_TERM_MISSING          (HttpStatus.BAD_REQUEST,           "SEARCH-001", "검색어를 입력해주세요"),
  SEARCH_INTERNAL_ERROR        (HttpStatus.INTERNAL_SERVER_ERROR, "SEARCH-002", "검색 중 오류가 발생했습니다"),

  /* 11. NOTIFICATION – 알림 */
  NOTIFICATION_NOT_FOUND       (HttpStatus.NOT_FOUND,             "NOTI-001",   "알림 정보를 찾을 수 없습니다"),
  NOTIFICATION_INVALID_STATE   (HttpStatus.BAD_REQUEST,           "NOTI-002",   "알림 상태 변경 요청이 잘못되었습니다"),

  /* 12. BADGE – 배지 */
  BADGE_ALREADY_UNLOCKED       (HttpStatus.BAD_REQUEST,           "BADGE-001",  "이미 획득한 뱃지입니다"),
  BADGE_NOT_FOUND              (HttpStatus.NOT_FOUND,             "BADGE-002",  "뱃지를 찾을 수 없습니다"),

  /* 13. AI – AI 서비스 */
  AI_SUMMARY_ERROR             (HttpStatus.BAD_REQUEST,           "AI-001",     "요약 요청을 수행할 수 없습니다"),
  AI_SERVICE_ERROR             (HttpStatus.INTERNAL_SERVER_ERROR, "AI-002",     "AI 서비스 오류가 발생했습니다"),
  AI_UNSUPPORTED_LINK          (HttpStatus.BAD_REQUEST,           "AI-003",     "지원하지 않는 링크입니다"),
  AI_TOO_MANY_REQUESTS         (HttpStatus.TOO_MANY_REQUESTS,     "AI-004",     "AI 요약 요청이 너무 많습니다"),
  AI_TAG_MATCH_FAIL            (HttpStatus.BAD_REQUEST,           "AI-005",     "태그 매칭 실패 – 기타로 분류됩니다");

  private final HttpStatus httpStatus;
  private final String code;
  private final String message;
}
