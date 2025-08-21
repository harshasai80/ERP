package com.sgp.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByEmail(String email);

    Optional<List<Faculty>> findByDepartment(String department);

    Integer deleteByEmail(String email);

}
