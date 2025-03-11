package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.IAMarks;
import com.sgp.erp.service.IAMarksService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/iamarks")
public class IAMarksController {

    @Autowired
    private IAMarksService iaMarksService;

    @GetMapping("/student/{registrationNumber}")
    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByRegistrationNumber(
            @PathVariable String registrationNumber) {
        return iaMarksService.getByRegistrationNumber(registrationNumber);
    }

    @GetMapping("/student/{registrationNumber}/subject/{subjectName}")
    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByRegistrationNumberAndSubject(
            @PathVariable String registrationNumber,
            @PathVariable String subjectName) {
        return iaMarksService.getByRegistrationNumberAndSubject(registrationNumber, subjectName);
    }
}
