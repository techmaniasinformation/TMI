package com.tmi.backend.domain.badge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long badgeId;

  @Column(length = 50, nullable = false)
  private String name;

  @Column(length = 255)
  private String description;

  @Column(length = 255)
  private String badgeUrl;

  public static Badge of(String name, String description, String badgeUrl) {
    return Badge.builder()
        .name(name)
        .description(description)
        .badgeUrl(badgeUrl)
        .build();
  }

}
