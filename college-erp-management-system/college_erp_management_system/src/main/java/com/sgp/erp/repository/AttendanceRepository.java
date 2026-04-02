package com.sgp.erp.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.sgp.erp.model.Attendance;
import com.sgp.erp.model.Student;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Find attendance by date and student register number
    @Query("SELECT a FROM Attendance a WHERE a.student.registrationNumber = ?2 AND a.attendanceDate = ?1")
    List<Attendance> findAttendanceByDateAndRegistrationNumber(LocalDate date, String registrationNumber);

    // Find attendance within a date range for a student
    @Query("SELECT a FROM Attendance a WHERE a.student.registrationNumber = ?1 AND a.attendanceDate BETWEEN ?2 AND ?3")
    List<Attendance> findAttendanceByRegistrationNumberAndDateRange(String registrationNumber, LocalDate startDate,
            LocalDate endDate, Pageable pageable);

    Optional<Attendance> findByStudentAndAttendanceDate(Student student, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date AND a.student.registrationNumber IN :regNos")
    List<Attendance> findAttendanceByDateAndRegistrationNumbers(LocalDate date, List<String> regNos);

    @Query("SELECT a FROM Attendance a WHERE a.student.registrationNumber = ?1")
    List<Attendance> findAttendanceByRegistrationNumber(String registrationNumber);

    @Query("SELECT a FROM Attendance a WHERE a.student.department = ?1 AND a.student.sem = ?2 AND a.student.section = ?3")
    List<Attendance> findAttendanceByClass(String department, Byte semester, com.sgp.erp.model.enums.Section section);
}
