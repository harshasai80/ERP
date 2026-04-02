package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.IAMarks;
import com.sgp.erp.service.IAMarksService;

import java.util.List;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RequestMapping("/iamarks")
public class IAMarksController {

    @Autowired
    private IAMarksService iaMarksService;

    @GetMapping("/student/{registrationNumber}")
    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByRegistrationNumber(
            @PathVariable(name = "registrationNumber") String registrationNumber) {
        return iaMarksService.getByRegistrationNumber(registrationNumber);
    }

    @GetMapping("/student/{registrationNumber}/subject/{subjectName}")
    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByRegistrationNumberAndSubject(
            @PathVariable(name = "registrationNumber") String registrationNumber,
            @PathVariable(name = "subjectName") String subjectName) {
        return iaMarksService.getByRegistrationNumberAndSubject(registrationNumber, subjectName);
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseStructure<IAMarks>> addIAMarks(@RequestBody IAMarks iaMarks) {
        return iaMarksService.addIAMarks(iaMarks);
    }

    @PostMapping("/add-bulk")
    public ResponseEntity<ResponseStructure<String>> bulkAddIAMarks(@RequestBody List<IAMarks> iaMarksList) {
        return iaMarksService.bulkAddIAMarks(iaMarksList);
    }

    @GetMapping("/filter")
    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByFilter(
            @RequestParam(name = "department") String department,
            @RequestParam(name = "semester") byte semester,
            @RequestParam(name = "section") String section,
            @RequestParam(name = "subjectId") Integer subjectId) {
        return iaMarksService.getByFilter(department, semester, section, subjectId);
    }
    @GetMapping("/class")
    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByClass(
            @RequestParam(name = "department") String department,
            @RequestParam(name = "semester") byte semester,
            @RequestParam(name = "section") String section) {
        return iaMarksService.getByClass(department, semester, section);
    }

    @PostMapping("/notify")
    public ResponseEntity<ResponseStructure<String>> notifyStudents(
            @RequestParam(name = "department") String department,
            @RequestParam(name = "semester") byte semester,
            @RequestParam(name = "section") String section,
            @RequestParam(name = "subjectId") Integer subjectId,
            @RequestParam(name = "iaType") String iaType) {
        iaMarksService.notifyStudents(department, semester, section, subjectId, iaType);
        ResponseStructure<String> response = new ResponseStructure<>();
        response.setData("Notification process started for " + iaType);
        response.setMessage("Emails are being sent in the background");
        response.setStatus(HttpStatus.ACCEPTED.value());
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }
}
