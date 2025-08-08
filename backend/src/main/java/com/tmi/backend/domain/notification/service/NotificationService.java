package com.tmi.backend.domain.notification.service;

import com.tmi.backend.domain.badge.entity.Badge;
import com.tmi.backend.domain.badge.repository.BadgeRepository;
import com.tmi.backend.domain.company.repository.CompanyRepository;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.repository.MemberRepository;
import com.tmi.backend.domain.notification.dto.request.NotificationCreateRequest;
import com.tmi.backend.domain.notification.dto.response.NotificationListResponse;
import com.tmi.backend.domain.notification.entity.Notification;
import com.tmi.backend.domain.notification.repository.NotificationRepository;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.post.repository.PostRepository;
import com.tmi.backend.global.common.response.ServiceResult;
import com.tmi.backend.global.error.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

  private final NotificationRepository notificationRepository;
  private final MemberRepository memberRepository;
  private final CompanyRepository companyRepository;
  private final BadgeRepository badgeRepository;
  private final PostRepository postRepository;

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

  @Transactional
  public ServiceResult<Map<String, Long>> createNotification(NotificationCreateRequest req) {
    Member receiver = memberRepository.findById(req.memberId()).orElse(null);
    if (receiver == null) {
      return ServiceResult.fail(ErrorCode.USER_NOT_FOUND);
    }

    Post post = null;
    if (req.postId() != null) {
      post = postRepository.findById(req.postId()).orElse(null);
      if (post == null) {
        return ServiceResult.fail(ErrorCode.POST_NOT_FOUND);
      }
    }

    Badge badge = null;
    if (req.badgeId() != null) {
      badge = badgeRepository.findById(req.badgeId()).orElse(null);
      if (badge == null) {
        return ServiceResult.fail(ErrorCode.BADGE_NOT_FOUND);
      }
    }
    Notification notif = Notification.of(receiver, req.type(), req.content(), post, badge);
    Notification newNotif = notificationRepository.save(notif);
    return ServiceResult.ok(Map.of("notificationId", newNotif.getId()));
  }
}
