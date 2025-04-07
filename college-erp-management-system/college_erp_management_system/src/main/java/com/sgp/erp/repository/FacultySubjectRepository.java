package com.sgp.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sgp.erp.model.FacultySubject;

public interface FacultySubjectRepository extends JpaRepository<FacultySubject, Long> {

    Optional<List<FacultySubject>> findByFacultyId(Long facultyId);
}
