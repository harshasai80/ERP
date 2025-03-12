package com.sgp.erp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Student;
import com.sgp.erp.repository.StudentRepository;

@Repository
public class StudentDao {
    @Autowired
    private StudentRepository studentRepository;

    public Optional<Student> findByRegistrationNumber(String registrationNumber) {
        return studentRepository.findByRegistrationNumber(registrationNumber);
    }

    public boolean addStudent(Student student) {
        Optional<Student> stu = findByRegistrationNumber(student.getRegistrationNumber());
        if (stu.isPresent()) {
            return false;
        }
        studentRepository.save(student);
        return true;
    }

    public List<Student> findAllStudentsByDepartmentAndSemester(String department, Byte semester) {
        return studentRepository.findAllStudentsByDepartmentAndSem(department, semester);
    }

}
