package com.tmi.backend.domain.company.repository;

import com.tmi.backend.domain.company.entity.Company;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {

  Optional<Company> findByName(String name);
}
