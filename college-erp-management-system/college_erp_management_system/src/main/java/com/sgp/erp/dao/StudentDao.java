package com.sgp.erp.dao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;
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

    public List<Student> findAllStudentsByDepartmentAndSemesterAndSection(String department, Byte semester,
            Section section) {
        List<Student> students = studentRepository.findAllStudentsByDepartmentAndSemAndSection(department, semester,
                section);
        students.sort(Comparator.comparingInt(s -> extractLastNo(s.getRegistrationNumber())));
        return students;
    }

    private static int extractLastNo(String regNo) {
        Matcher matcher = Pattern.compile("(\\d+)$").matcher(regNo);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;

    }

    public Boolean uploadStudents(MultipartFile studentsFile) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(studentsFile.getInputStream()));
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

                Optional<Student> existingStudent = findByRegistrationNumber(registrationNumber);
                if (existingStudent.isPresent()) {
                    System.out.println("Student with registration number " + registrationNumber + " already exists.");
                    continue;
                } else {
                    studentRepository.save(student);
                }
            }
            return true;
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to process CSV file.");
        }
    }

    public Student update(String registrationNumber, Student student) {
        Optional<Student> existingStudent = studentRepository.findByRegistrationNumber(registrationNumber);
        if (existingStudent.isPresent()) {
            Student updateExistingStudent = existingStudent.get();

            updateExistingStudent.setName(student.getName());
            updateExistingStudent.setDepartment(student.getDepartment());
            updateExistingStudent.setSem(student.getSem());
            updateExistingStudent.setSection(student.getSection());
            return studentRepository.save(updateExistingStudent);
        }
        return null;
    }

    public Optional<List<Student>> findByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

}
