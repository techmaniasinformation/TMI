package com.tmi.backend.domain.comment.repository;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
  boolean existsByMemberAndPost(Member member, Post post);

  @EntityGraph(attributePaths = {
      "member",
      "post",
      "recommendations"})
  Optional<Comment> findById(Long id);
}
