package com.sgp.erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.IAMarks;

import org.springframework.transaction.annotation.Transactional;
import com.sgp.erp.model.Subject;

@Repository
public interface IAMarksRepository extends JpaRepository<IAMarks, Long> {
    @Query("SELECT i FROM IAMarks i WHERE i.student.registrationNumber = ?1")
    List<IAMarks> findByRegistrationNumber(String registrationNumber);

    @Query("SELECT i FROM IAMarks i WHERE i.student.registrationNumber = ?1 AND i.subject.subjectName = ?2")
    List<IAMarks> findByRegistrationNumberAndSubjectName(String registrationNumber, String subjectName);

    @Query("SELECT i FROM IAMarks i WHERE i.student.department = ?1 AND i.student.sem = ?2 AND i.student.section = ?3 AND i.subject.subjectId = ?4")
    List<IAMarks> findByFilter(String department, byte semester, com.sgp.erp.model.enums.Section section, Integer subjectId);

    @Query("SELECT i FROM IAMarks i WHERE i.student.department = ?1 AND i.student.sem = ?2 AND i.student.section = ?3")
    List<IAMarks> findByClass(String department, byte semester, com.sgp.erp.model.enums.Section section);

    @Transactional
    void deleteBySubject(Subject subject);
}