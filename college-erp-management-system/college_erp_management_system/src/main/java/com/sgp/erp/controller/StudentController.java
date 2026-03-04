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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/login")
    public ResponseEntity<ResponseStructure<Student>> studentLogin(
            @RequestParam(name = "registrationNumber") String registrationNumber) {
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
            @RequestParam(name = "department") String department,
            @RequestParam(name = "semester") Byte semester,
            @RequestParam(name = "section") Section section,
            @RequestParam(name = "startRegNo", required = false) String startRegNo,
            @RequestParam(name = "endRegNo", required = false) String endRegNo) {

        return studentService.findAllStudentsByDepartmentAndSemesterAndSection(
                department, semester, section, startRegNo, endRegNo);
    }

    @PostMapping("/upload")
    public ResponseEntity<ResponseStructure<String>> uploadStudents(@RequestParam(name = "file") MultipartFile file) {
        return studentService.uploadStudent(file);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseStructure<Student>> updateStudent(
            @RequestParam(name = "registrationNumber") String registrationNumber,
            @RequestBody Student student) {
        return studentService.updateStudent(registrationNumber, student);
    }

    @PutMapping("/bulk-update")
    public ResponseEntity<ResponseStructure<String>> updateBulkStudents(@RequestBody List<Student> students) {
        return studentService.updateBulkStudents(students);
    }

    @GetMapping("/department")
    public ResponseEntity<ResponseStructure<List<Student>>> findByDepartment(
            @RequestParam(name = "department") String department) {
        return studentService.findByDepartment(department);
    }

    @GetMapping("/all-students")
    public ResponseEntity<ResponseStructure<List<Student>>> getAllStudents() {
        return studentService.getAllStudents();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseStructure<String>> deleteStudent(
            @RequestParam(name = "registrationNumber") String registrationNumber) {
        return studentService.deleteStudent(registrationNumber);
    }

    @PostMapping("/update-registration-numbers")
    public ResponseEntity<ResponseStructure<String>> updateAllRegistrationNumbers() {
        return studentService.updateAllRegistrationNumbers();
    }

    @PostMapping("/migrate-department")
    public ResponseEntity<ResponseStructure<String>> migrateDepartment(
            @RequestParam(name = "oldDepartment") String oldDepartment,
            @RequestParam(name = "newDepartment") String newDepartment) {
        return studentService.migrateDepartment(oldDepartment, newDepartment);
    }

}