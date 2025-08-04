package com.tmi.backend.domain.memberBadge.repository;

import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberBadgeRepository extends JpaRepository<MemberBadge, Long> {

  @Query("""
        SELECT mb.badge.badgeUrl
          FROM MemberBadge mb
         WHERE mb.member.id = :memberId
           AND mb.isRepresentative = true
      """)
  Optional<String> findRepresentativeBadgeUrlByMemberId(@Param("memberId") Long memberId);
}