package com.tmi.backend.domain.postScore.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
public class PostScore {

  @Id
  @Column(name = "post_id")
  private Long postId;

  @Column(nullable = false)
  private double score;

  @Column(name = "computed_at", nullable = false)
  private LocalDateTime computedAt;

  public static PostScore of(Long postId, double score, LocalDateTime computedAt) {
    return PostScore.builder()
        .postId(postId)
        .score(score)
        .computedAt(computedAt)
        .build();
  }

  public void update(double score, LocalDateTime computedAt) {
    this.score = score;
    this.computedAt = computedAt;
  }
}
