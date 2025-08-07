package com.tmi.backend.domain.notification.repository;

import com.tmi.backend.domain.notification.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  @EntityGraph(attributePaths = {
      "post",
      "post.member",
      "post.company",
      "badge"
  })
  @Query("""
        SELECT n
          FROM Notification n
         WHERE n.member.id = :memberId
         ORDER BY n.createdAt DESC
      """)
  List<Notification> findAllByMemberId(@Param("memberId") Long memberId);

  @EntityGraph(attributePaths = {
      "post",
      "post.member",
      "post.company",
      "badge"
  })
  @Query("""
        SELECT n
          FROM Notification n
         WHERE n.member.id = :memberId
           AND n.isRead = false
         ORDER BY n.createdAt DESC
      """)
  List<Notification> findUnreadByMemberId(@Param("memberId") Long memberId);

  @Modifying
  @Query("DELETE FROM Notification n WHERE n.member.id = :memberId")
  void deleteAllByMemberId(@Param("memberId") Long memberId);
}
