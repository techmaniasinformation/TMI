package com.tmi.backend.domain.company.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
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
