package com.tmi.backend.domain.badge.repository;

import com.tmi.backend.domain.badge.dto.response.SimpleBadge;
import com.tmi.backend.domain.badge.entity.Badge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

  @Query("""
        SELECT new com.tmi.backend.domain.badge.dto.response.SimpleBadge(
          b.id, b.name, b.description, b.badgeUrl
        )
        FROM Badge b
      """)
  List<SimpleBadge> findAllSimpleBadges();
}