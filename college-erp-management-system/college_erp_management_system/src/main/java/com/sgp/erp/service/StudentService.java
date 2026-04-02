package com.sgp.erp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dao.StudentDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.StudentDoesExistException;
import com.sgp.erp.exception.StudentNotDeletedException;
import com.sgp.erp.exception.StudentNotFoundException;
import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;

import jakarta.transaction.Transactional;

@Service
public class StudentService {

    @Autowired
    private StudentDao studentDao;
    private ResponseStructure<Student> structure;

    public ResponseEntity<ResponseStructure<Student>> findByRegistrationNumber(String registrationNumber) {
        String regNo = registrationNumber != null ? registrationNumber.toUpperCase().trim() : "";
        Optional<Student> student = studentDao.findByRegistrationNumber(regNo);
        structure = new ResponseStructure<Student>();
        if (student.isPresent()) {
            structure.setData(student.get());
            structure.setMessage("Student found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<Student>>(structure,
                    HttpStatus.OK);
        }
        throw new StudentNotFoundException();
    }

    public ResponseEntity<ResponseStructure<Student>> addStudent(Student student) {
        structure = new ResponseStructure<Student>();
        boolean res = studentDao.addStudent(student);
        if (res) {
            structure.setData(student);
            structure.setMessage("Student added successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<Student>>(structure, HttpStatus.CREATED);
        }

        throw new StudentDoesExistException();
    }

    public ResponseEntity<ResponseStructure<List<Student>>> findAllStudentsByDepartmentAndSemesterAndSection(
            String department, Byte semester, Section section,
            String startRegNo, String endRegNo) {

        ResponseStructure<List<Student>> structure = new ResponseStructure<>();

        List<Student> students = studentDao.findAllStudentsByDepartmentAndSemesterAndSection(department, semester,
                section);

        if (startRegNo != null && endRegNo != null) {
            students = students.stream()
                    .filter(s -> s.getRegistrationNumber().compareTo(startRegNo) >= 0 &&
                            s.getRegistrationNumber().compareTo(endRegNo) <= 0)
                    .collect(Collectors.toList());
        }

        structure.setData(students);
        structure.setMessage(students.isEmpty() ? "No students found" : "Students found");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    public ResponseEntity<ResponseStructure<String>> uploadStudent(MultipartFile file) {
        ResponseStructure<String> structure = new ResponseStructure<String>();
        Boolean res = studentDao.uploadStudents(file);
        if (res) {
            structure.setData("File uploaded successfully");
            structure.setMessage("File uploaded successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.CREATED);
        }
        throw new StudentDoesExistException();
    }

    public ResponseEntity<ResponseStructure<Student>> updateStudent(String registrationNumber, Student student) {
        ResponseStructure<Student> structure = new ResponseStructure<Student>();
        Student updatedStudent = studentDao.update(registrationNumber, student);
        if (updatedStudent != null) {
            structure.setData(updatedStudent);
            structure.setMessage("Student updated successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<Student>>(structure, HttpStatus.OK);
        }
        throw new StudentNotFoundException();
    }

    public ResponseEntity<ResponseStructure<List<Student>>> findByDepartment(String department) {
        ResponseStructure<List<Student>> structure = new ResponseStructure<List<Student>>();
        Optional<List<Student>> students = studentDao.findByDepartment(department);
        List<Student> docs = students.orElse(List.of());
        structure.setData(docs);
        structure.setMessage(docs.isEmpty() ? "No students found" : "Students found");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<ResponseStructure<List<Student>>>(structure, HttpStatus.OK);
    }

    public ResponseEntity<ResponseStructure<List<Student>>> getAllStudents() {
        ResponseStructure<List<Student>> structure = new ResponseStructure<List<Student>>();
        List<Student> students = studentDao.getAllStudents();
        structure.setData(students);
        structure.setMessage(students.isEmpty() ? "No students found" : "Students found");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<ResponseStructure<List<Student>>>(structure, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> deleteStudent(String registrationNumber) {
        ResponseStructure<String> structure = new ResponseStructure<String>();
        boolean res = studentDao.deleteStudent(registrationNumber);
        if (res) {
            structure.setData("Student deleted successfully");
            structure.setMessage("Student deleted successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.OK);
        }
        throw new StudentNotDeletedException();
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> updateBulkStudents(List<Student> students) {
        ResponseStructure<String> structure = new ResponseStructure<String>();
        if (students == null || students.isEmpty()) {
            throw new IllegalArgumentException("Student list is empty");
        }
        studentDao.updateBulkStudents(students);
        structure.setData("Students updated successfully");
        structure.setMessage("Students updated successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> updateAllRegistrationNumbers() {
        ResponseStructure<String> structure = new ResponseStructure<String>();
        int updatedCount = studentDao.updateAllRegistrationNumbers();
        structure.setData("Registration numbers updated successfully");
        structure.setMessage(updatedCount + " registration numbers updated successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> migrateDepartment(String oldDepartment, String newDepartment) {
        ResponseStructure<String> structure = new ResponseStructure<String>();
        int updatedCount = studentDao.updateDepartmentForAllStudents(oldDepartment, newDepartment);
        structure.setData("Department migration completed successfully");
        structure.setMessage(updatedCount + " students migrated from " + oldDepartment + " to " + newDepartment);
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.OK);
    }

}
