package com.tmi.backend.domain.follow.company.entity;

import com.tmi.backend.domain.company.entity.Company;
import com.tmi.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CompanyFollow {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long companyFollowId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "follower_id", nullable = false)
  private Member follower;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "company_id", nullable = false)
  private Company company;

  private LocalDateTime createdAt;

  public static CompanyFollow of(Member follower, Company company) {
    return CompanyFollow.builder()
        .follower(follower)
        .company(company)
        .build();
  }
}


