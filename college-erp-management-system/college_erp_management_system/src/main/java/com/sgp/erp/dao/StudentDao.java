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
import com.sgp.erp.model.Student;
import com.sgp.erp.model.enums.Section;
import com.sgp.erp.repository.StudentRepository;

import jakarta.transaction.Transactional;
import com.sgp.erp.exception.DataNotSavedException;

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

            csvReader.skip(5); // Skips first 5 lines (headers/instructions)
            String[] nextRecord;
            int rowNumber = 6;

            while ((nextRecord = csvReader.readNext()) != null) {
                try {
                    if (nextRecord.length < 5) {
                        throw new DataNotSavedException("Row " + rowNumber + " has insufficient fields. Expected at least 5.");
                    }
                    String registrationNumber = nextRecord[0].trim();
                    String name = nextRecord[1].trim();
                    String department = nextRecord[2].trim().toUpperCase();
                    byte sem = Byte.parseByte(nextRecord[3].trim());
                    Section section = Section.valueOf(nextRecord[4].trim().toUpperCase());
                    
                    // Optional parent details (columns 6 and 7)
                    String parentPhone = (nextRecord.length > 5 && nextRecord[5] != null) ? nextRecord[5].trim() : "";
                    String parentEmail = (nextRecord.length > 6 && nextRecord[6] != null) ? nextRecord[6].trim() : "";

                    Student student = new Student();
                    student.setRegistrationNumber(registrationNumber);
                    student.setName(name);
                    student.setDepartment(department);
                    student.setSem(sem);
                    student.setSection(section);
                    student.setParentPhone(parentPhone);
                    student.setParentEmail(parentEmail);

                    Optional<Student> existingStudent = findByRegistrationNumber(registrationNumber);
                    if (existingStudent.isPresent()) {
                        Student updateStudent = existingStudent.get();
                        updateStudent.setName(name);
                        updateStudent.setDepartment(department);
                        updateStudent.setSem(sem);
                        updateStudent.setSection(section);
                        updateStudent.setParentPhone(parentPhone);
                        updateStudent.setParentEmail(parentEmail);
                        studentRepository.save(updateStudent);
                    } else {
                        studentRepository.save(student);
                    }
                } catch (Exception e) {
                    throw new DataNotSavedException("Error at row " + rowNumber + ": " + (e.getMessage() != null ? e.getMessage() : "Invalid data format. Ensure your file is a CSV and sections are A, B, C, or D."));
                }
                rowNumber++;
            }
            return true;
        } catch (IOException | CsvValidationException e) {
            throw new DataNotSavedException("Failed to process CSV file: " + e.getMessage());
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
            if (student.getRegistrationNumber() != null && !student.getRegistrationNumber().isEmpty()) {
                updateExistingStudent.setRegistrationNumber(student.getRegistrationNumber());
            }
            return studentRepository.save(updateExistingStudent);
        }
        return null;
    }

    public Optional<List<Student>> findByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    public List<Student> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        if (!students.isEmpty()) {
            return students;
        } else {
            throw new RuntimeException("No students found.");
        }
    }

    public boolean deleteStudent(String registrationNumber) {
        Integer result = studentRepository.deleteByRegistrationNumber(registrationNumber);
        return result > 0; // Returns true if at least one record was deleted
    }

    public void updateBulkStudents(List<Student> students) {
        students.forEach(t -> studentRepository.updateStudents(t));
    }

    @Transactional
    public int updateAllRegistrationNumbers() {
        List<Student> allStudents = studentRepository.findAll();
        int count = 0;

        for (Student student : allStudents) {
            String oldRegNo = student.getRegistrationNumber();

            // Pattern to match registration numbers like "459DME01"
            // Captures: (prefix)(department)(serial)
            Pattern pattern = Pattern.compile("^(\\d+)([A-Z]+)(\\d+)$");
            Matcher matcher = pattern.matcher(oldRegNo);

            if (matcher.find()) {
                String prefix = matcher.group(1); // e.g., "459"
                String department = matcher.group(2); // e.g., "DME"
                String serial = matcher.group(3); // e.g., "01"

                // Create new registration number with "25" inserted
                String newRegNo = prefix + department + "25" + serial;

                // Only update if the pattern doesn't already contain "25"
                if (!oldRegNo.contains("25")) {
                    student.setRegistrationNumber(newRegNo);
                    studentRepository.save(student);
                    count++;
                }
            }
        }

        return count;
    }

    @Transactional
    public int updateDepartmentForAllStudents(String oldDepartment, String newDepartment) {
        return studentRepository.updateDepartmentForAll(oldDepartment, newDepartment);
    }

}
