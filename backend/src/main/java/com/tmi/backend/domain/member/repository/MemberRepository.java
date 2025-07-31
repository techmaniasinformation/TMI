package com.tmi.backend.domain.member.repository;

import com.tmi.backend.domain.member.dto.response.MemberStats;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.member.entity.Provider;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {

  Optional<Member> findById(Long memberId);

  //한 번의 쿼리로 MemberStats DTO를 조회.( 게시글 수, 댓글 수, 팔로워 수, 조회수 합계)
  @Query("""
        SELECT new com.tmi.backend.domain.member.dto.response.MemberStats(
          (SELECT COUNT(p)   FROM Post p          WHERE p.member.id = :memberId),
          (SELECT COUNT(c)   FROM Comment c       WHERE c.post.member.id = :memberId),
          (SELECT COUNT(f)   FROM MemberFollow f  WHERE f.followee.id = :memberId),
          (SELECT COALESCE(SUM(p2.viewCount), 0)  FROM Post p2         WHERE p2.member.id = :memberId)
        )
        FROM Member m
        WHERE m.id = :memberId
      """)
  MemberStats fetchStatsById(@Param("memberId") Long memberId);

  boolean existsByNickname(String nickname);

  Optional<Member> findByProviderAndProviderMemberId(Provider provider, String providerMemberId);

}
