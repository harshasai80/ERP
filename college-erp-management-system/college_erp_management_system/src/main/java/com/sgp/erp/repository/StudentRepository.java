package com.sgp.erp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE s.registrationNumber = ?1")
    Optional<Student> findByRegistrationNumber(String registrationNumber);

    List<Student> findAllStudentsByDepartmentAndSemAndSection(String department, Byte sem, Section section);

    Optional<List<Student>> findByDepartment(String department);

    @Modifying
    @Query("DELETE FROM Student s WHERE s.registrationNumber = ?1")
    Integer deleteByRegistrationNumber(String registrationNumber);

    @Modifying
    @Query("UPDATE Student s SET " +
            "s.name = :#{#student.name}, " +
            "s.registrationNumber = :#{#student.registrationNumber}, " +
            "s.department = :#{#student.department}, " +
            "s.sem = :#{#student.sem}, " +
            "s.section = :#{#student.section} WHERE s.id = :#{#student.id}")
    void updateStudents(@Param("student") Student student);

    @Modifying
    @Query("UPDATE Student s SET s.department = :newDepartment WHERE s.department = :oldDepartment")
    Integer updateDepartmentForAll(@Param("oldDepartment") String oldDepartment,
            @Param("newDepartment") String newDepartment);
}
