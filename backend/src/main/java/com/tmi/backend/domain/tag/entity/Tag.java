package com.tmi.backend.domain.tag.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Tag {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "tag_id")
  private Long id;

  @Column(nullable = false)
  private String name;

  @Enumerated(EnumType.STRING)
  private TagType tagType;
}
