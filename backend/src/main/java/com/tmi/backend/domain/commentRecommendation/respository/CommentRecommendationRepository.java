package com.tmi.backend.domain.commentRecommendation.respository;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.commentRecommendation.entity.CommentRecommendation;
import com.tmi.backend.domain.member.entity.Member;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CommentRecommendationRepository extends JpaRepository<CommentRecommendation, Long> {

  boolean existsByMemberAndComment(Member member, Comment comment);

  @Query("""
        select distinct cr
        from CommentRecommendation cr
              join fetch cr.comment c
              join fetch c.post p
        where (:memberId is null or cr.member.id = :memberId)
          and (:postId   is null or p.id       = :postId)
        """)
  List<CommentRecommendation> findAllByMemberIdAndPostId(
      @Param("memberId") Long memberId,
      @Param("postId")   Long postId);

  @Modifying
  @Transactional
  void deleteAllByMemberId(Long memberId);

}
