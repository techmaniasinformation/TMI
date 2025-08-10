package com.tmi.backend.domain.post.entity;

import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.member.entity.Member;
import com.tmi.backend.domain.postTag.entity.PostTag;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

  @Column(length = 8192)
  private String content;

  private String thumbnailUrl;

  @Builder.Default
  private int viewCount = 0;

  @Builder.Default
  private int starCount = 0;

  @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, orphanRemoval = true)
  @Builder.Default
  private List<PostTag> postTags = new ArrayList<>();

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  public static Post of(
      Member member,
      String title,
      String link,
      String content,
      String thumbnailUrl
  ) {
    return Post.builder()
        .member(member)
        .company(null)  // 사용자가 작성한 게시글은 별도의 회사를 받지 않음
        .title(title)
        .link(link)
        .content(content)
        .thumbnailUrl(thumbnailUrl)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
  }

  public void change(String title, String content, String link, String thumbnailUrl) {
    if (title != null) {
      this.title = title;
    }

    if (content != null) {
      this.content = content;
    }

    if (link != null) {
      this.link = link;
    }

    if (thumbnailUrl != null) {
      this.thumbnailUrl = thumbnailUrl;
    }

    updatedAt = LocalDateTime.now();
  }

  public void plusStarCount() {
    this.starCount++;
  }

  public void minusStarCount() {
    this.starCount--;
  }

  public void updateViewCount() {
    this.viewCount++;
  }
}
