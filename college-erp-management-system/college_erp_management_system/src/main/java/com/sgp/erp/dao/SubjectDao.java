package com.sgp.erp.dao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.sgp.erp.model.Subject;
import com.sgp.erp.repository.SubjectRepository;

@Repository
public class SubjectDao {

    @Autowired
    private SubjectRepository subjectRepository;

    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Integer subjectId) {
        subjectRepository.deleteById(subjectId);
    }

    public List<Subject> findByDepartmentAndSemester(String department, Byte semester) {
        return subjectRepository.findByDepartmentAndSemester(department, semester);
    }

    public Boolean uploadSubjectsCSV(MultipartFile subjectsFile) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(subjectsFile.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

            String[] nextRecord;
            csvReader.skip(5); // Skip the first 5 lines if they are headers or comments
            System.out.println("Processing CSV file...");
            while ((nextRecord = csvReader.readNext()) != null) {
                if (nextRecord.length < 6) {
                    throw new RuntimeException("Insufficient fields in CSV file. Expected at least 6 fields.");
                }
                String subjectCode = nextRecord[0];
                String subjectName = nextRecord[1];
                String department = nextRecord[2];
                byte sem = Byte.parseByte(nextRecord[3]);
                int maxMarks = nextRecord[4] == null ? 0 : Integer.parseInt(nextRecord[4]);
                int value = nextRecord[5] == null ? 0 : Integer.parseInt(nextRecord[5]);

                Subject subject = new Subject();
                subject.setSubjectCode(subjectCode);
                subject.setSubjectName(subjectName);
                subject.setDepartment(department);
                subject.setSemester(sem);
                subject.setMaxMarks(maxMarks);
                subject.setValue(value);

                Subject existingSubject = subjectRepository.findBySubjectCode(subjectCode);
                if (existingSubject != null) {
                    System.out.println("Subject with code " + subjectCode + " already exists.");
                    continue;
                } else {
                    System.out.println("Saving subject...");
                    subjectRepository.save(subject);
                }

            }
            return true;
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to process CSV file.");
        }
    }

    public List<Subject> findByDepartment(String department) {
        return subjectRepository.findByDepartment(department);
    }

    public void deleteByDepartment(String department) {
        subjectRepository.deleteByDepartment(department);
    }
}
