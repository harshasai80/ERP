package com.sgp.erp.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Attendance;
import com.sgp.erp.service.AttendanceService;

@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RestController
@RequestMapping("/students")
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    // Get attendance by date and register number
    @GetMapping("/{registerNo}/date")
    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDate(
            @PathVariable(name = "registerNo") String registerNo,
            @RequestParam(name = "date") LocalDate date) {
        return attendanceService.getAttendanceByDateAndRegisterNo(date, registerNo);
    }

    // Get attendance by register number and date range
    @GetMapping("/{registerNo}/range")
    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDateRange(
            @PathVariable(name = "registerNo") String registerNo,
            @RequestParam(name = "startDate") LocalDate startDate,
            @RequestParam(name = "endDate") LocalDate endDate) {
        return attendanceService.getAttendanceByRegisterNoAndDateRange(registerNo, startDate, endDate);
    }

    // Add attendance records
    @PostMapping("/add-attendance")
    public ResponseEntity<ResponseStructure<List<Attendance>>> addAttendanceRecords(
            @RequestBody List<Map<String, Object>> attendanceData) {
        return attendanceService.addAttendanceRecords(attendanceData);
    }

    @GetMapping("/all-attendance")
    public ResponseEntity<ResponseStructure<List<Attendance>>> getAllAttendanceByRegisterNo(
            @RequestParam(name = "registerNo") String registerNo) {
        return attendanceService.getAttendanceByRegisterNo(registerNo);
    }

    @PostMapping("/bulk-date-attendance")
    public ResponseEntity<ResponseStructure<List<Attendance>>> getAttendanceByDateAndRegisterNos(
            @RequestParam(name = "date") LocalDate date,
            @RequestBody List<String> regNos) {
        return attendanceService.getAttendanceByDateAndRegisterNos(date, regNos);
    }

}
