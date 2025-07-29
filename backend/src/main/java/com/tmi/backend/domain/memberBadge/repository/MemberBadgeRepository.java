package com.tmi.backend.domain.memberBadge.repository;

import com.tmi.backend.domain.memberBadge.entity.MemberBadge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberBadgeRepository extends JpaRepository<MemberBadge, Long> {

}
