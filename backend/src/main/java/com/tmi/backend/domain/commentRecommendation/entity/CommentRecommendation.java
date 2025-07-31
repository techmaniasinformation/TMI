package com.tmi.backend.domain.commentRecommendation.entity;

import com.tmi.backend.domain.comment.entity.Comment;
import com.tmi.backend.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CommentRecommendation {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "comment_reco_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "comment_id", nullable = false)
  private Comment comment;

  private LocalDateTime createdAt;

  public static CommentRecommendation of(Member member, Comment comment) {
    return CommentRecommendation.builder()
        .member(member)
        .comment(comment)
        .createdAt(LocalDateTime.now())
        .build();
  }

  public void assignToComment(Comment comment) {
    this.comment = comment;
    comment.getRecommendations().add(this);
  }
}
