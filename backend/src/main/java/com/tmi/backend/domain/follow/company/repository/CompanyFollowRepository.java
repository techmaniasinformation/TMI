package com.tmi.backend.domain.follow.company.repository;

import com.tmi.backend.domain.follow.company.dto.response.SimpleCompanyFollow;
import com.tmi.backend.domain.follow.company.entity.CompanyFollow;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyFollowRepository extends JpaRepository<CompanyFollow, Long> {

  @Query("""
        SELECT new com.tmi.backend.domain.follow.company.dto.response.SimpleCompanyFollow(
            cf.id,
            c.id,
            c.name,
            c.companyProfileUrl
        )
        FROM CompanyFollow cf
        JOIN cf.company c
        WHERE cf.follower.id = :followerId
      """
  )
  Page<SimpleCompanyFollow> findSimpleByFollowerId(
      @Param("followerId") Long followerId,
      Pageable pageable
  );

  boolean existsByFollowerIdAndCompanyId(Long followerId, Long companyId);

  @Modifying
  @Query("DELETE FROM CompanyFollow cf WHERE cf.follower.id = :memberId")
  void deleteByFollowerId(@Param("memberId") Long memberId);

  List<CompanyFollow> findByFollowerId(Long followerId);
}