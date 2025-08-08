package com.tmi.backend.domain.notification.dto.request;

import com.tmi.backend.domain.badge.entity.BadgeType;
import com.tmi.backend.domain.notification.entity.NotificationType;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record NotificationCreateRequest(
    Long memberId,             // 알림 받을 회원
    Long postId,               // 게시글
    Long badgeId,              // 뱃지
    NotificationType type,     // 알림 타입 (예: "NEW_COMMENT")
    String content             // 알림 메시지
) {

  public static NotificationCreateRequest of(Long memberId, Long postId, BadgeType badgeType,
      NotificationType type) {

    String content = switch (type) {
      case NEW_COMMENT ->
          content = "회원님의 게시글에 새 댓글이 달렸습니다.";
      case BADGE_ACQUIRED ->
          content = badgeType.getName() + "배지를 획득하였습니다.";
      case MEMBER_NEW_POST ->
          content = "회원님이 팔로우한 회원님이 새 게시글을 작성했습니다.";
      case COMPANY_NEW_POST ->
          content = "회원님이 팔로우한 기업의 새 게시글이 등록되었습니다.";
    };

    return NotificationCreateRequest.builder()
        .memberId(memberId)
        .postId(postId)
        .badgeId(badgeType != null ? badgeType.getId() : null)
        .type(type)
        .content(content)
        .build();
  }
}
