package com.sgp.erp.dao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgp.erp.model.Attendance;
import com.sgp.erp.model.Student;
import com.sgp.erp.repository.AttendanceRepository;
import com.sgp.erp.repository.StudentRepository;

@Repository
public class AttendanceDao {

    @Autowired
    private AttendanceRepository attendanceRepository;
    private StudentRepository studentRepository;
    private ObjectMapper objectMapper = new ObjectMapper();

    public AttendanceDao(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    // Find attendance by date and register number
    public List<Attendance> getAttendanceByDateAndRegisterNo(LocalDate date, String registerNo) {
        return attendanceRepository.findAttendanceByDateAndRegistrationNumber(date, registerNo);
    }

    // Find attendance between start date and end date
    public List<Attendance> getAttendanceByRegisterNoAndDateRange(String registerNo, LocalDate startDate,
            LocalDate endDate) {
        return attendanceRepository.findAttendanceByRegistrationNumberAndDateRange(registerNo, startDate, endDate);
    }

    // Add attendance records
    public List<Attendance> addAttendanceRecords(List<Map<String, Object>> attendanceData) {
        List<Attendance> savedAttendances = new ArrayList<>();

        for (Map<String, Object> entry : attendanceData) {
            String registerNo = entry.get("registrationNumber").toString();
            LocalDate date = LocalDate.parse(entry.get("date").toString());
            List<Map<String, Object>> sessions = (List<Map<String, Object>>) entry.get("sessions");

            // Fetch student by register number
            Optional<Student> studentOpt = studentRepository.findByRegistrationNumber(registerNo);
            if (studentOpt.isEmpty()) {
                throw new RuntimeException("Student with register number " + registerNo + " not found.");
            }

            Student student = studentOpt.get();
            Optional<Attendance> attendanceOpt = attendanceRepository.findByStudentAndAttendanceDate(student, date);
            Attendance attendance;

            if (attendanceOpt.isPresent()) {
                attendance = attendanceOpt.get();
            } else {
                attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setAttendanceDate(date);
                attendance.setSessions("[]"); // Start with empty JSON array
            }

            try {
                // Convert existing JSON to List
                List<Map<String, Object>> existingSessions = objectMapper.readValue(attendance.getSessions(),
                        new TypeReference<>() {
                        });
                existingSessions.addAll(sessions); // Add new sessions
                attendance.setSessions(objectMapper.writeValueAsString(existingSessions)); // Convert back to JSON
            } catch (Exception e) {
                throw new RuntimeException("Error processing JSON", e);
            }

            savedAttendances.add(attendance);
        }

        return attendanceRepository.saveAll(savedAttendances);
    }
}