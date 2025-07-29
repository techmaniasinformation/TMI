package com.tmi.backend.domain.badge.repository;

import com.tmi.backend.domain.badge.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

}
