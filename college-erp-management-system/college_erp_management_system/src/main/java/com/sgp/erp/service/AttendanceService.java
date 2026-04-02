package com.sgp.erp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sgp.erp.dao.AttendanceDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.DataNotFoundException;
import com.sgp.erp.exception.DataNotSavedException;
import com.sgp.erp.model.Attendance;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceDao attendanceDao;

    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDateAndRegisterNo(LocalDate date,
            String registrationNumber) {

        List<Attendance> attendances = attendanceDao.getAttendanceByDateAndRegisterNo(date, registrationNumber);
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!attendances.isEmpty()) {
            structure.setData(attendances);
            structure.setMessage("Attendances found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException("Attendance not found");
    }

    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByRegisterNoAndDateRange(String registerNo,
            LocalDate startDate, LocalDate endDate) {

        List<Attendance> attendances = attendanceDao.getAttendanceByRegisterNoAndDateRange(registerNo, startDate,
                endDate);
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!attendances.isEmpty()) {
            structure.setData(attendances);
            structure.setMessage("Attendances found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException("Attendance not found");
    }

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.sgp.erp.repository.StudentRepository studentRepository;

    @Autowired
    private LoggerService loggerService;

    public ResponseEntity<ResponseStructure<List<Attendance>>> addAttendanceRecords(
            List<Map<String, Object>> attendanceData) {

        List<Attendance> savedAttendances = attendanceDao.addAttendanceRecords(attendanceData);
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!savedAttendances.isEmpty()) {

            System.out.println("Attendance Saved - Count: " + savedAttendances.size());
            loggerService.log("FACULTY", "ATTENDANCE_SAVED", "Saved " + savedAttendances.size() + " attendance records");

            // Process asynchronous notifications for absenteeism
            for (Map<String, Object> entry : attendanceData) {
                try {
                    String registerNo = entry.get("registrationNumber").toString();
                    LocalDate date = LocalDate.parse(entry.get("date").toString());
                    Integer subjectId = entry.get("subjectId") != null ? Integer.parseInt(entry.get("subjectId").toString()) : null;

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> sessions = (List<Map<String, Object>>) entry.get("sessions");

                    for (Map<String, Object> session : sessions) {
                        if ("Absent".equalsIgnoreCase(String.valueOf(session.get("status")))) {
                            System.out.println("Absent Status Detected for: " + registerNo);
                            java.util.Optional<com.sgp.erp.model.Student> studentOpt = studentRepository.findByRegistrationNumber(registerNo);
                            if (studentOpt.isPresent()) {
                                System.out.println("Triggering SMS Service for student: " + studentOpt.get().getName());
                                notificationService.sendAbsentSms(studentOpt.get(), date, subjectId);
                            } else {
                                System.err.println("Student record NOT FOUND for regNo: " + registerNo + ". Cannot send notification.");
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Notification trigger failed: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            structure.setData(savedAttendances);
            structure.setMessage("Attendances saved successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.CREATED);
        }
        throw new DataNotSavedException("Attendances not saved");
    }

    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByRegisterNo(String registerNo) {
        List<Attendance> attendances = attendanceDao.getAttendanceByRegisterNo(registerNo);
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!attendances.isEmpty()) {
            structure.setData(attendances);
            structure.setMessage("Attendances found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException("Attendance not found");
    }

    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDateAndRegisterNos(LocalDate date,
            List<String> regNos) {
        List<Attendance> attendances = attendanceDao.getAttendanceByDateAndRegisterNos(date, regNos);
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!attendances.isEmpty()) {
            structure.setData(attendances);
            structure.setMessage("Attendances found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException("Attendance not found");
    }

    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByClass(String dept, Byte sem, String section) {
        List<Attendance> attendances = attendanceDao.getAttendanceByClass(dept, sem, com.sgp.erp.model.enums.Section.valueOf(section));
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!attendances.isEmpty()) {
            structure.setData(attendances);
            structure.setMessage("Attendances found for class");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException("No attendance records found for this class");
    }

}
