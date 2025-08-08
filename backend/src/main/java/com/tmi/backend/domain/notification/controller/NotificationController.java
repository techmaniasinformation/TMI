package com.tmi.backend.domain.notification.controller;

import com.tmi.backend.domain.notification.dto.request.NotificationCreateRequest;
import com.tmi.backend.domain.notification.dto.response.EventPayloadResponse;
import com.tmi.backend.domain.notification.dto.response.NotificationListResponse;
import com.tmi.backend.domain.notification.service.NotificationService;
import com.tmi.backend.global.common.controller.BaseController;
import com.tmi.backend.global.common.response.ApiResponse;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController implements BaseController {

  private final NotificationService notificationService;

  /**
   * 구독 수락 API
   * @param userId 구독 유저 ID
   * @return SseEmitter
   */
  @GetMapping(value = "/subscribe/{userId}", produces = "text/event-stream")
  public SseEmitter subscribe(@PathVariable Long userId) {
    return notificationService.subscribe(userId);
  }

  /**
   * 구독한 멤버에게 이벤트 전송
   * @param userId 구독 유저 ID
   * @param eventPayload 이벤트 페이로드
   */
  @PostMapping("/broadcast/{userId}")
  public void broadcast(@PathVariable Long userId, @RequestBody EventPayloadResponse eventPayload) {
    notificationService.broadcast(userId, eventPayload);
  }

  /**
   * 전체 알림 조회 API
   */
  @GetMapping
  public ResponseEntity<ApiResponse<NotificationListResponse>> getNotifications(
      @RequestParam Long memberId,
      @RequestParam(defaultValue = "all") String status) {
    return handle(notificationService.getNotifications(memberId, status));
  }

  /**
   * 개별 알림 읽음 처리 API
   */
  @PatchMapping("/{notificationId}/read")
  public ResponseEntity<ApiResponse<Map<String, Long>>> readNotification(
      @PathVariable Long notificationId
  ) {
    return handle(notificationService.readNotification(notificationId));
  }

  /**
   * 전체 알림 읽음 처리 API
   */
  @PatchMapping("/read/all")
  public ResponseEntity<ApiResponse<Map<String, List<Long>>>> readAllNotifications(
      @RequestParam Long memberId
  ) {
    return handle(notificationService.readAllNotifications(memberId));
  }

  /**
   * 개별 알림 삭제 API
   */
  @DeleteMapping("/{notificationId}")
  public ResponseEntity<ApiResponse<Map<String, Long>>> deleteNotification(
      @PathVariable Long notificationId,
      @RequestParam Long memberId
  ) {
    return handle(notificationService.deleteNotification(notificationId, memberId));
  }

  /**
   * 전체 알림 삭제 API
   */
  @DeleteMapping("/all")
  public ResponseEntity<ApiResponse<Map<String, Integer>>> deleteAllNotifications(
      @RequestParam Long memberId
  ) {
    return handle(notificationService.deleteAllNotifications(memberId));
  }

}
