package com.tmi.backend.domain.comment.entity;

import com.tmi.backend.domain.commentRecommendation.entity.CommentRecommendation;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.post.entity.Post;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
public class Comment {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "comment_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  @Column(nullable = false)
  private String content;

  private String link;

  @Builder.Default
  private int recommendCount = 0;

  private LocalDateTime createdAt;

  @Builder.Default
  @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = true)
  private List<CommentRecommendation> recommendations = new ArrayList<>();

  public static Comment of(
      Post post,
      Member member,
      String content,
      String link
  ){
    return Comment.builder()
        .post(post)
        .member(member)
        .content(content)
        .link(link)
        .createdAt(LocalDateTime.now())
        .build();
  }

  public void plusRecommendCount() {
    this.recommendCount++;
  }

  public void minusRecommendCount() {
    this.recommendCount--;
  }
}
