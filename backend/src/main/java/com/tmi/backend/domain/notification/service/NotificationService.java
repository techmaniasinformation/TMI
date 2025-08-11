package com.tmi.backend.domain.notification.service;

import com.tmi.backend.domain.auth.util.SecurityUtil;
import com.tmi.backend.domain.badge.entity.Badge;
import com.tmi.backend.domain.badge.repository.BadgeRepository;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.notification.dto.request.NotificationCreateRequest;
import com.tmi.backend.domain.notification.dto.response.EventPayloadResponse;
import com.tmi.backend.domain.notification.dto.response.NotificationListResponse;
import com.tmi.backend.domain.notification.entity.Notification;
import com.tmi.backend.domain.notification.repository.EmitterRepository;
import com.tmi.backend.domain.notification.repository.NotificationRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

  private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

  private final NotificationRepository notificationRepository;
  private final MemberRepository memberRepository;
  private final CompanyRepository companyRepository;
  private final BadgeRepository badgeRepository;
  private final PostRepository postRepository;
  private final EmitterRepository emitterRepository;

  public SseEmitter subscribe(Long userId) {
    SseEmitter sseEmitter = emitterRepository.save(userId, new SseEmitter(DEFAULT_TIMEOUT));

    sseEmitter.onCompletion(() -> emitterRepository.deleteById(userId));

    sseEmitter.onTimeout(() -> emitterRepository.deleteById(userId));

    // 최초 신호
    sendToClient(userId, "subscribe event, memberId : " + userId);
    return sseEmitter;
  }

  public void broadcast(Long userId, EventPayloadResponse eventPayload) {
    sendToClient(userId, eventPayload);
  }

  private void sendToClient(Long userId, Object data) {
    SseEmitter sseEmitter = emitterRepository.findById(userId);

    if (sseEmitter == null) {
      // ▶ 여기서 바로 NPE 방지 & 오프라인 처리
      log.warn("[SSE][MISS] no subscriber for userId={}, skip sending (dataType={})",
          userId, data.getClass().getSimpleName());
      return;
    }

    try {
      sseEmitter.send(
          SseEmitter.event()
              .id(userId.toString())
              .name("sse")
              .data(data)
      );
    } catch (IllegalStateException | IOException ex) {
      // 끊긴 커넥션 정리
      emitterRepository.deleteById(userId);
      log.warn("[SSE][DROP] userId={} removed emitter due to {}: {}",
          userId, ex.getClass().getSimpleName(), ex.getMessage());
      // 전파 금지(서비스 흐름 보호)
    }
  }

  public ServiceResult<NotificationListResponse> getNotifications(Long memberId, String status) {
    List<Notification> notifications;

    if ("unread".equalsIgnoreCase(status)) {
      notifications = notificationRepository.findUnreadByMemberId(memberId);
    } else {
      notifications = notificationRepository.findAllByMemberId(memberId);
    }
    return ServiceResult.ok(NotificationListResponse.from(notifications));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> readNotification(Long notificationId) {
    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    if (notification == null) {
      return ServiceResult.fail(ErrorCode.NOTIFICATION_NOT_FOUND);
    }
    if (!SecurityUtil.memberCheck(notification.getMember().getId())) {
      return ServiceResult.fail(ErrorCode.AUTH_ACCESS_DENIED);
    }

    if (!notification.getIsRead()) {
      notification.updateIsRead();
    }

    return ServiceResult.ok(Map.of("notificationId", notificationId));
  }

  @Transactional
  public ServiceResult<Map<String, List<Long>>> readAllNotifications(Long memberId) {
    List<Notification> unreadNotifications = notificationRepository.findUnreadByMemberId(memberId);

    List<Long> updatedIds = new ArrayList<>();
    for (Notification notification : unreadNotifications) {
      if (!notification.getIsRead()) {
        notification.updateIsRead();
        updatedIds.add(notification.getId());
      }
    }

    return ServiceResult.ok(Map.of("updatedIds", updatedIds));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> deleteNotification(Long notificationId, Long memberId) {
    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    if (notification == null) {
      return ServiceResult.fail(ErrorCode.NOTIFICATION_NOT_FOUND);
    }

    if (!notification.getMember().getId().equals(memberId)) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    notificationRepository.delete(notification);
    return ServiceResult.ok(Map.of("deletedId", notificationId));
  }

  @Transactional
  public ServiceResult<Map<String, Integer>> deleteAllNotifications(Long memberId) {
    List<Notification> notifications = notificationRepository.findAllByMemberId(memberId);

    int count = notifications.size();
    notificationRepository.deleteAll(notifications);

    return ServiceResult.ok(Map.of("deletedCount", count));
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void createNotification(NotificationCreateRequest req) {
    Member receiver = memberRepository.findById(req.memberId()).orElse(null);
    if (receiver == null) {
      return;
    }

    Post post = null;
    if (req.postId() != null) {
      post = postRepository.findById(req.postId()).orElse(null);
      if (post == null) {
        return;
      }
    }

    Badge badge = null;
    if (req.badgeId() != null) {
      badge = badgeRepository.findById(req.badgeId()).orElse(null);
      if (badge == null) {
        return;
      }
    }
    Notification notif = Notification.of(receiver, req.type(), req.content(), post, badge);
    Notification newNotif = notificationRepository.save(notif);

    this.broadcast(receiver.getId(),
        EventPayloadResponse.of(newNotif.getId(), receiver.getId(), req.content()));
  }
}
