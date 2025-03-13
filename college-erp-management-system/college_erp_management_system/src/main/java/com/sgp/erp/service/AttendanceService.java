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
        throw new DataNotFoundException();
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
        throw new DataNotFoundException();
    }

    public ResponseEntity<ResponseStructure<List<Attendance>>> addAttendanceRecords(List<Map<String, Object>> attendanceData) {

        List<Attendance> savedAttendances = attendanceDao.addAttendanceRecords(attendanceData);
        ResponseStructure<List<Attendance>> structure = new ResponseStructure<List<Attendance>>();

        if (!savedAttendances.isEmpty()) {
            structure.setData(savedAttendances);
            structure.setMessage("Attendances saved successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<List<Attendance>>>(structure, HttpStatus.CREATED);
        }
        throw new DataNotSavedException();
    }


}
