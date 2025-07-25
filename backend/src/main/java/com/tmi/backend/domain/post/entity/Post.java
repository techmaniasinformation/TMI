package com.tmi.backend.domain.post.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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
public class Post {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "post_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id")
  private Member member;


  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "company_id")
  private Company company;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String link;

  private String content;

  private String thumbnailUrl;

  @Builder.Default
  private int viewCount = 0;

  @Builder.Default
  private int starCount = 0;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;
}
