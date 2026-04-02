package com.sgp.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import com.sgp.erp.model.FacultySubject;
import com.sgp.erp.model.Subject;

public interface FacultySubjectRepository extends JpaRepository<FacultySubject, Long> {

    Optional<List<FacultySubject>> findByFacultyId(Long facultyId);

    @Transactional
    void deleteBySubject(Subject subject);
}
