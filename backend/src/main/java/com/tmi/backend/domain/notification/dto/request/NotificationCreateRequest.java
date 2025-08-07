package com.tmi.backend.domain.notification.dto.request;

import com.tmi.backend.domain.notification.entity.NotificationType;

public record NotificationCreateRequest(
    Long memberId,             // 알림 받을 회원
    Long postId,               // 게시글
    Long badgeId,              // 뱃지
    NotificationType type,     // 알림 타입 (예: "NEW_COMMENT")
    String content             // 알림 메시지
) {

}
