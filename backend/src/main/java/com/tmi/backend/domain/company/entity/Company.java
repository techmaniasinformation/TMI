package com.tmi.backend.domain.company.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
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
public class Company {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long companyId;

  @Column(length = 100, nullable = false)
  private String name;
  
  @Column(length = 255)
  private String companyProfileUrl;

  @Column(length = 255)
  private String techBlogUrl;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  public static Company of(String name, String description, String companyProfileUrl,
      String techBlogUrl) {
    return Company.builder()
        .name(name)
        .companyProfileUrl(companyProfileUrl)
        .techBlogUrl(techBlogUrl)
        .build();
  }
}
