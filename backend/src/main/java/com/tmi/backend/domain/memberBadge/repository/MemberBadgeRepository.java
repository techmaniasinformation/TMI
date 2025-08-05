package com.tmi.backend.domain.memberBadge.repository;

import com.tmi.backend.domain.memberBadge.dto.response.SimpleMemberBadge;
import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberBadgeRepository extends JpaRepository<MemberBadge, Long> {

  @Query("""
        SELECT new com.tmi.backend.domain.memberBadge.dto.response.SimpleMemberBadge(
          mb.id,
          mb.badge.id,
          mb.receivedAt
        )
        FROM MemberBadge mb
        WHERE mb.member.id = :memberId
        ORDER BY mb.receivedAt DESC
      """)
  List<SimpleMemberBadge> findAllSimpleByMemberId(
      @Param("memberId") Long memberId
  );

  @Modifying(clearAutomatically = true)
  @Query("""
        UPDATE MemberBadge mb
           SET mb.isRepresentative =
             CASE WHEN mb.id = :targetId THEN true ELSE false END
         WHERE mb.member.id = (
           SELECT m2.member.id
             FROM MemberBadge m2
            WHERE m2.id = :targetId
         )
      """)
  int updateRepresentative(@Param("targetId") Long targetId);

  @Modifying
  @Query("DELETE FROM MemberBadge mb WHERE mb.member.id = :memberId")
  void deleteAllByMemberId(@Param("memberId") Long memberId);

}

