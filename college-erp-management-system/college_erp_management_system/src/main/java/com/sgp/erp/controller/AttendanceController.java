package com.sgp.erp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
