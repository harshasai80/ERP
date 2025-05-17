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
import com.sgp.erp.exception.FacultyNotFoundException;
import com.sgp.erp.exception.StudentDoesExistException;
import com.sgp.erp.exception.StudentNotFoundException;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;

@Service
public class StudentService {

    @Autowired
    private StudentDao studentDao;
    private ResponseStructure<Student> structure;

    public ResponseEntity<ResponseStructure<Student>> findByRegistrationNumber(String registrationNumber) {
        Optional<Student> student = studentDao.findByRegistrationNumber(registrationNumber);
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

        if (!students.isEmpty()) {
            structure.setData(students);
            structure.setMessage("Students found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<>(structure, HttpStatus.OK);
        }

        throw new StudentNotFoundException();
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
        if (students.isPresent()) {
            structure.setData(students.get());
            structure.setMessage("Students found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Student>>>(structure, HttpStatus.OK);
        }
        throw new StudentNotFoundException();
    }

}
