package com.sgp.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    
}
