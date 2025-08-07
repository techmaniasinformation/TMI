package com.tmi.backend.domain.memberBadge.repository;

import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberBadgeRepository extends JpaRepository<MemberBadge, Long> {

  @EntityGraph(attributePaths = "badge")
  List<MemberBadge> findAllByMember_IdOrderByReceivedAtDesc(Long memberId);

  @EntityGraph(attributePaths = "badge")
  List<MemberBadge> findAllByMemberIdInAndIsRepresentativeTrue(Collection<Long> memberIds);

  @Query("SELECT mb.member.id FROM MemberBadge mb WHERE mb.id = :targetId")
  Long findMemberIdById(@Param("targetId") Long targetId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE MemberBadge mb SET mb.isRepresentative = false WHERE mb.member.id = :memberId")
  void cancleRepresentative(@Param("memberId") Long memberId);

  @Modifying(clearAutomatically = true)
  @Query("UPDATE MemberBadge mb SET mb.isRepresentative = true WHERE mb.id = :targetId")
  void setRepresentative(@Param("targetId") Long targetId);

  void deleteByMemberId(@Param("memberId") Long memberId);

}

