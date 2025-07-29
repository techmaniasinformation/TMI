package com.tmi.backend.domain.post.repository;

import com.tmi.backend.domain.post.entity.Post;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

  @Query("""
      SELECT MAX(p.createdAt)
      FROM Post p
      WHERE p.company.companyId = :companyId
      """)
  Optional<LocalDateTime> findLatestCreatedAtByCompanyId(@Param("companyId") Long companyId);
}
