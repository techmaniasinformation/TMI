package com.tmi.backend.domain.comment.repository;

import com.tmi.backend.domain.comment.dto.CommentCount;
import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
  boolean existsByMemberAndPost(Member member, Post post);

  @EntityGraph(attributePaths = {
      "member",
      "post",
      "recommendations" })
  Optional<Comment> findById(Long id);

  @EntityGraph(attributePaths = { "member" })
  List<Comment> findByPostId(Long postId, Sort sort);

  @EntityGraph(attributePaths = { "post", "member" })
  Page<Comment> findByMemberId(Long memberId, Pageable pageable);

  // 추천수를 n 개 이상 받은 댓글 중 가장 추천을 많이 받은 댓글 (추천수가 같다면 등록일 순 오름차순)
  Optional<Comment> findTopByRecommendCountGreaterThanEqualOrderByRecommendCountDescCreatedAtAsc(int minCount);

  @Query("""
        select c.post.id as postId, count(c) as cnt
        from Comment c
        where c.post.id in :postIds
        group by c.post.id
      """)
  List<CommentCount> findCountByPostIds(@Param("postIds") List<Long> postIds);

  int countByPostId(Long postId);

  int countByMemberId(Long memberId);

  List<Comment> findAllByMemberId(Long memberId);

  @Query("select sum(c.recommendCount) from Comment c where c.member.id = :memberId")
  Integer sumRecommendCountByMemberId(Long memberId);

  @org.springframework.data.jpa.repository.Modifying
  @Query("UPDATE Comment c SET c.recommendCount = c.recommendCount + 1 WHERE c.id = :id")
  void incrementRecommendCount(@Param("id") Long id);

  @org.springframework.data.jpa.repository.Modifying
  @Query("UPDATE Comment c SET c.recommendCount = c.recommendCount - 1 WHERE c.id = :id AND c.recommendCount > 0")
  void decrementRecommendCount(@Param("id") Long id);
}
