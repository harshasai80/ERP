package com.sgp.erp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dao.StudentDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.StudentDoesExistException;
import com.sgp.erp.exception.StudentNotFoundException;
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

    public ResponseEntity<ResponseStructure<List<Student>>> findAllStudentsByDepartmentAndSemesterAndSection(String department,
            Byte semester, Section section) {
        ResponseStructure<List<Student>> structure = new ResponseStructure<List<Student>>();
        List<Student> students = studentDao.findAllStudentsByDepartmentAndSemesterAndSection(department, semester,
                section);
        if (!students.isEmpty()) {
            structure.setData(students);
            structure.setMessage("Students found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Student>>>(structure, HttpStatus.OK);
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

}
