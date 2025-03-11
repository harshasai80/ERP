package com.sgp.erp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Attendance;
// import com.sgp.erp.model.Student;
// import com.sgp.erp.repository.AttendanceRepository;
import com.sgp.erp.service.AttendanceService;

@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RestController
@RequestMapping("/students")
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    // @GetMapping("/attendance")
    // public ResponseEntity<?> getStudentAttendance(@RequestParam String
    // registrationNumber) {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();

    // System.out.println("🔍 Request received for /student/attendance/" +
    // registrationNumber);
    // System.out.println("🔐 Authenticated user: " + (authentication != null ?
    // authentication.getName() : "NULL"));
    // System.out.println("👤 Roles: " + (authentication != null ?
    // authentication.getAuthorities() : "NONE"));

    // if (authentication == null || !authentication.isAuthenticated()) {
    // return ResponseEntity.status(403).body("Forbidden: User is not
    // authenticated.");
    // }

    // List<Attendance> attendance =
    // attendanceRepository.findByStudentId(registrationNumber);
    // System.out.println("📝 Fetched " + attendance.size() + " attendances for " +
    // registrationNumber);
    // return ResponseEntity.ok(attendance);
    // }

    // Get attendance by date and register number
    @GetMapping("/{registerNo}/date")
    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDate(@PathVariable String registerNo,
            @RequestParam LocalDate date) {
        return attendanceService.getAttendanceByDateAndRegisterNo(date, registerNo);
    }

    // Get attendance by register number and date range
    @GetMapping("/{registerNo}/range")
    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDateRange(
            @PathVariable String registerNo,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return attendanceService.getAttendanceByRegisterNoAndDateRange(registerNo, startDate, endDate);
    }

}
