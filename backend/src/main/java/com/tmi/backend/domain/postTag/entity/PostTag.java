package com.tmi.backend.domain.postTag.entity;

import com.tmi.backend.domain.post.entity.Post;
import com.tmi.backend.domain.tag.entity.Tag;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class PostTag {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "post_tag_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "tag_id", nullable = false)
  private Tag tag;

  public static PostTag of(Post post, Tag tag) {
    return PostTag.builder()
        .post(post)
        .tag(tag)
        .build();
  }

  public void assignToPost(Post post) {
    this.post = post;
    post.getPostTags().add(this);
  }
}
