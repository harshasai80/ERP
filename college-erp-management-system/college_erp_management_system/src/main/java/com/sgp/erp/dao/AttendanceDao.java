package com.sgp.erp.dao;

import java.time.LocalDate;
import java.util.*;
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

    @Autowired
    private StudentRepository studentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Attendance> getAttendanceByDateAndRegisterNo(LocalDate date, String registerNo) {
        return attendanceRepository.findAttendanceByDateAndRegistrationNumber(date, registerNo);
    }

    public List<Attendance> getAttendanceByRegisterNoAndDateRange(String registerNo, LocalDate startDate,
            LocalDate endDate) {
        return attendanceRepository.findAttendanceByRegistrationNumberAndDateRange(registerNo, startDate, endDate);
    }

    public List<Attendance> addAttendanceRecords(List<Map<String, Object>> attendanceData) {
        List<Attendance> savedAttendances = new ArrayList<>();

        for (Map<String, Object> entry : attendanceData) {
            try {
                String registerNo = entry.get("registrationNumber").toString();
                LocalDate date = LocalDate.parse(entry.get("date").toString());
                Integer subjectId = Integer.parseInt(entry.get("subjectId").toString());
                String batch = entry.get("batch") != null ? entry.get("batch").toString() : null;

                List<Map<String, Object>> sessions = (List<Map<String, Object>>) entry.get("sessions");

                Optional<Student> studentOpt = studentRepository.findByRegistrationNumber(registerNo);
                if (studentOpt.isEmpty()) {
                    throw new RuntimeException("Student with register number " + registerNo + " not found.");
                }

                Student student = studentOpt.get();
                Optional<Attendance> attendanceOpt = attendanceRepository.findByStudentAndAttendanceDate(student, date);
                Attendance attendance = attendanceOpt.orElseGet(() -> {
                    Attendance a = new Attendance();
                    a.setStudent(student);
                    a.setAttendanceDate(date);
                    a.setSessions("[]");
                    return a;
                });

                // Parse current sessions JSON
                List<Map<String, Object>> existingSessions = objectMapper.readValue(
                        attendance.getSessions(), new TypeReference<>() {
                        });

                // Add subjectId and batch to new sessions
                for (Map<String, Object> session : sessions) {
                    session.put("subjectId", subjectId);
                    session.put("batch", batch);
                }

                existingSessions.addAll(sessions);
                attendance.setSessions(objectMapper.writeValueAsString(existingSessions));

                savedAttendances.add(attendance);

            } catch (Exception e) {
                throw new RuntimeException("Error processing attendance record: " + entry, e);
            }
        }

        return attendanceRepository.saveAll(savedAttendances);
    }
}
