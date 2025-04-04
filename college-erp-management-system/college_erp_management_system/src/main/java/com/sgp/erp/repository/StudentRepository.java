package com.sgp.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE s.registrationNumber = ?1")
    Optional<Student> findByRegistrationNumber(String registrationNumber);

    List<Student> findAllStudentsByDepartmentAndSemAndSection(String department, Byte sem, Section section);

}
