package com.sgp.erp.dao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.sgp.erp.exception.StudentDoesExistException;
import com.sgp.erp.model.Section;
import com.sgp.erp.model.Student;
import com.sgp.erp.repository.StudentRepository;

import jakarta.transaction.Transactional;

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

    public List<Student> findAllStudentsByDepartmentAndSemesterAndSection(String department, Byte semester,
            Section section) {
        return studentRepository.findAllStudentsByDepartmentAndSemAndSection(department, semester, section);
    }

    public Boolean uploadStudents(MultipartFile studentsFile) {
        try(BufferedReader reader = new BufferedReader(new InputStreamReader(studentsFile.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

                    String[] nextRecord;
                    csvReader.readNext();

                    while ((nextRecord = csvReader.readNext()) != null) {
                        String registrationNumber = nextRecord[0];
                        String name = nextRecord[1];
                        String department = nextRecord[2];
                        byte sem = Byte.parseByte(nextRecord[3]);
                        Section section = Section.valueOf(nextRecord[4]);

                        Student student = new Student();
                        student.setRegistrationNumber(registrationNumber);
                        student.setName(name);
                        student.setDepartment(department);
                        student.setSem(sem);
                        student.setSection(section);
                        try {
                            studentRepository.save(student);
                        } catch (Exception e) {
                            System.out.println("Student with registration number " + registrationNumber + " already exists.");
                            continue;
                        }
                    }

                    return true;
        
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to process CSV file.");
        }
    }

}
