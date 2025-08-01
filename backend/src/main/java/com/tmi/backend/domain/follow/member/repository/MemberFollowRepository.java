package com.tmi.backend.domain.follow.member.repository;

import com.tmi.backend.domain.follow.member.entity.MemberFollow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberFollowRepository extends JpaRepository<MemberFollow, Long> {

}
