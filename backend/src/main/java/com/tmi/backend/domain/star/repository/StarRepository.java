package com.tmi.backend.domain.star.repository;

import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.star.entity.Star;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StarRepository extends JpaRepository<Star, Long> {
  boolean existsByMemberAndPost(Member member, Post post);
  @EntityGraph(attributePaths = {"post"})
  List<Star> findByMember(Member member);

  void deleteByMemberId(@Param("memberId") Long memberId);

}
