package com.tmi.backend.domain.post.repository;

import com.tmi.backend.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

  @Query("""
      SELECT MAX(p.createdAt)
      FROM Post p
      WHERE p.company.id = :companyId
      """)
  Optional<LocalDateTime> findLatestCreatedAtById(@Param("companyId") Long companyId);

  @EntityGraph(attributePaths = {
      "member",
      "company",
      "postTags.tag"
  })
  Optional<Post> findById(Long id);

  @EntityGraph(attributePaths = {
      "member",
      "company"
  })
  Page<Post> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

  @EntityGraph(attributePaths = {
      "member",
      "company"
  })
  Page<Post> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);

  @EntityGraph(attributePaths = {
      "member",
      "company"
  })
  Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
