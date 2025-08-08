package com.tmi.backend.domain.follow.member.repository;

import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface MemberFollowRepository extends JpaRepository<MemberFollow, Long> {

  Page<MemberFollow> findByFollowerId(Long followerId, Pageable pageable);

  boolean existsByFollowerIdAndFolloweeId(Long followerId, Long followeeId);

  @Modifying
  void deleteByFollowerIdOrFolloweeId(Long memberId, Long memberId2);

  List<MemberFollow> findByFollowerId(Long followerId);

  @Modifying
  int removeById(Long id);

  MemberFollow findFollowerIdById(Long memberFollowId);
}