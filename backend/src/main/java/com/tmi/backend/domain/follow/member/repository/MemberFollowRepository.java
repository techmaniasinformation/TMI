package com.tmi.backend.domain.follow.member.repository;

import com.tmi.backend.domain.follow.member.dto.response.SimpleMemberFollow;
import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberFollowRepository extends JpaRepository<MemberFollow, Long> {

  @Query("""
      SELECT new com.tmi.backend.domain.follow.member.dto.response.SimpleMemberFollow(
          mf.id,
          u.id,
          u.nickname,
          u.memberProfileUrl,
          (
            SELECT mb.badge.badgeUrl
              FROM MemberBadge mb
             WHERE mb.member.id    = u.id
               AND mb.isRepresentative = true
          )
        )
        FROM MemberFollow mf
        JOIN mf.followee u
        WHERE mf.follower.id = :followerId
      """)
  Page<SimpleMemberFollow> findSimpleByFollowerId(
      @Param("followerId") Long followerId,
      Pageable pageable
  );

  boolean existsByFollowerIdAndFolloweeId(Long followerId, Long followeeId);

  @Modifying
  @Query("DELETE FROM MemberFollow mf WHERE mf.follower.id = :memberId OR mf.followee.id = :memberId")
  void deleteAllByFollowerOrFollowee(@Param("memberId") Long memberId);
}