package com.tmi.backend.domain.star.repository;

import com.tmi.backend.domain.star.entity.Star;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StarRepository extends JpaRepository<Star, Long> {

}
