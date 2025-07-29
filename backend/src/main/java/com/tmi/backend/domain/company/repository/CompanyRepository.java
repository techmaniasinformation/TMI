package com.tmi.backend.domain.company.repository;

import com.tmi.backend.domain.company.dto.response.CompanyStats;
import com.tmi.backend.domain.company.entity.Company;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends JpaRepository<Company, Long> {

  Optional<Company> findById(Long companyId);

  Optional<Company> findByName(String name);

  @Query("""
      SELECT new com.tmi.backend.domain.company.dto.response.CompanyStats(
        (SELECT COUNT(p)   FROM Post p            WHERE p.company.id = :companyId),
        (SELECT COUNT(f)   FROM CompanyFollow f   WHERE f.company.id = :companyId),
        (SELECT COALESCE(SUM(p2.viewCount), 0) FROM Post p2 WHERE p2.company.id = :companyId)
      )
      FROM Company c
      WHERE c.id = :companyId
      """)
  CompanyStats fetchStatsById(@Param("companyId") Long companyId);
}