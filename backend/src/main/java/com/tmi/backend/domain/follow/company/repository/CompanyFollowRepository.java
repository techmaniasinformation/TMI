package com.tmi.backend.domain.follow.company.repository;

import com.tmi.backend.domain.follow.company.entity.CompanyFollow;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

public interface CompanyFollowRepository extends JpaRepository<CompanyFollow, Long> {

  Page<CompanyFollow> findByFollowerId(Long followerId, Pageable pageable);

  boolean existsByFollowerIdAndCompanyId(Long followerId, Long companyId);

  @Modifying
  void deleteByFollowerId(@Param("memberId") Long memberId);

  List<CompanyFollow> findByFollowerId(Long followerId);

  @Modifying
  int removeById(Long companyFollowId);

  List<CompanyFollow> findByCompanyId(Long companyId);
}