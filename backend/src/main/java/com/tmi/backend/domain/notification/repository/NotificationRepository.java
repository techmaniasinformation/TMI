package com.tmi.backend.domain.notification.repository;

import com.tmi.backend.domain.notification.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  @Query("""
          SELECT n
          FROM Notification n
          LEFT JOIN FETCH n.member
          LEFT JOIN FETCH n.senderMember
          LEFT JOIN FETCH n.senderCompany
          LEFT JOIN FETCH n.post
          LEFT JOIN FETCH n.badge
          WHERE n.member.id = :memberId
          ORDER BY n.createdAt DESC
      """)
  List<Notification> findAllByMemberId(@Param("memberId") Long memberId);

  @Query("""
          SELECT n
          FROM Notification n
          LEFT JOIN FETCH n.member
          LEFT JOIN FETCH n.senderMember
          LEFT JOIN FETCH n.senderCompany
          LEFT JOIN FETCH n.post
          LEFT JOIN FETCH n.badge
          WHERE n.member.id = :memberId AND n.isRead = false
          ORDER BY n.createdAt DESC
      """)
  List<Notification> findUnreadByMemberId(@Param("memberId") Long memberId);

  @Modifying
  @Query("DELETE FROM Notification n WHERE n.member.id = :memberId")
  void deleteAllByMemberId(@Param("memberId") Long memberId);
}
