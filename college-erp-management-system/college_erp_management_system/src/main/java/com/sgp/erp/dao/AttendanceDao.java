package com.sgp.erp.dao;

import java.time.LocalDate;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgp.erp.exception.DuplicateDataEntryException;
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

    Pageable pageable = PageRequest.of(0, 30);

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Attendance> getAttendanceByDateAndRegisterNo(LocalDate date, String registerNo) {
        return attendanceRepository.findAttendanceByDateAndRegistrationNumber(date, registerNo);
    }

    public List<Attendance> getAttendanceByRegisterNoAndDateRange(String registerNo, LocalDate startDate,
            LocalDate endDate) {
        return attendanceRepository.findAttendanceByRegistrationNumberAndDateRange(registerNo, startDate, endDate,
                pageable);
    }

    public List<Attendance> addAttendanceRecords(List<Map<String, Object>> attendanceData) {
        List<Attendance> savedAttendances = new ArrayList<>();

        for (Map<String, Object> entry : attendanceData) {
            try {
                String registerNo = entry.get("registrationNumber").toString();
                LocalDate date = LocalDate.parse(entry.get("date").toString());
                Integer subjectId = Integer.parseInt(entry.get("subjectId").toString());
                String batch = (entry.get("batch") == null || entry.get("batch").toString().trim().isEmpty())
                        ? null
                        : entry.get("batch").toString();

                @SuppressWarnings("unchecked")
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

                // Parse existing session JSON
                List<Map<String, Object>> existingSessions = objectMapper.readValue(
                        attendance.getSessions(), new TypeReference<>() {
                        });

                for (Map<String, Object> newSession : sessions) {
                    newSession.put("subjectId", subjectId);
                    newSession.put("batch", batch);

                    Integer newSessionNumber = (Integer) newSession.get("session");

                    boolean isDuplicate = existingSessions.stream()
                            .anyMatch(existing -> Objects.equals(existing.get("subjectId"), newSession.get("subjectId"))
                                    &&
                                    Objects.equals(existing.get("batch"), newSession.get("batch")) &&
                                    Objects.equals(existing.get("session"), newSessionNumber));

                    if (isDuplicate) {
                        throw new DuplicateDataEntryException(
                                "Duplicate session detected for student " + registerNo + " on " + date);
                    }
                }

                // Add the new sessions to existing
                existingSessions.addAll(sessions);
                attendance.setSessions(objectMapper.writeValueAsString(existingSessions));

                savedAttendances.add(attendance);

            } catch (Exception e) {
                throw new RuntimeException("Error processing attendance record: " + entry, e);
            }
        }

        return attendanceRepository.saveAll(savedAttendances);
    }

    public List<Attendance> getAttendanceByRegisterNo(String registerNo) {
        return attendanceRepository.findAttendanceByRegistrationNumber(registerNo);
    }

}
