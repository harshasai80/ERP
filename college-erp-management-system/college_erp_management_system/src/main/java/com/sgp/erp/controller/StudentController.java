package com.sgp.erp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;
import com.sgp.erp.service.StudentService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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

    @PostMapping("/add")
    public ResponseEntity<ResponseStructure<Student>> addStudent(@RequestBody Student student) {
        System.out.println("student added: " + student.getName());
        return studentService.addStudent(student);
    }

    @GetMapping("/all")
public ResponseEntity<ResponseStructure<List<Student>>> findAllStudentsByDepartmentAndSemesterAndSection(
        @RequestParam String department,
        @RequestParam Byte semester,
        @RequestParam Section section,
        @RequestParam(required = false) String startRegNo,
        @RequestParam(required = false) String endRegNo) {

    return studentService.findAllStudentsByDepartmentAndSemesterAndSection(
            department, semester, section, startRegNo, endRegNo);
}


    @PostMapping("/upload")
    public ResponseEntity<ResponseStructure<String>> uploadStudents(@RequestParam MultipartFile file) {
        return studentService.uploadStudent(file);
    }

}