package com.tmi.backend.domain.memberBadge.repository;

import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberBadgeRepository extends JpaRepository<MemberBadge, Long> {

  @Query("""
          SELECT mb
          FROM MemberBadge mb
          JOIN FETCH mb.badge
          WHERE mb.member.id = :memberId
          ORDER BY mb.receivedAt DESC
      """)
  List<MemberBadge> findAllByMemberIdFetchBadge(@Param("memberId") Long memberId);

  @Query("SELECT mb.member.id FROM MemberBadge mb WHERE mb.id = :targetId")
  Long findMemberIdById(@Param("targetId") Long targetId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE MemberBadge mb SET mb.isRepresentative = false WHERE mb.member.id = :memberId")
  void clearRepresentative(@Param("memberId") Long memberId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE MemberBadge mb SET mb.isRepresentative = true WHERE mb.id = :targetId")
  void setRepresentative(@Param("targetId") Long targetId);

  @Modifying
  @Query("DELETE FROM MemberBadge mb WHERE mb.member.id = :memberId")
  void deleteAllByMemberId(@Param("memberId") Long memberId);

}

