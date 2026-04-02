package com.sgp.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Subject;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {

    List<Subject> findByDepartmentAndSemester(String department, Byte semester);
    List<Subject> findByDepartment(String department);
    Subject findBySubjectCode(String subjectCode);

    @Transactional
    void deleteByDepartment(String department);

}
