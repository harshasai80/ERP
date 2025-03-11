package com.sgp.erp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Student;
import com.sgp.erp.service.StudentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/login")
    public ResponseEntity<ResponseStructure<Student>> studentLogin(@RequestParam String registrationNumber) {
        System.out.println("Got it! Registration Number: " + registrationNumber);
        return studentService.findByRegistrationNumber(registrationNumber);
    }

}