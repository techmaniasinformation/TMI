package com.tmi.backend.domain.badge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Badge {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "badge_id")
  private Long id;

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
