package com.sgp.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dao.SubjectDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.DataNotFoundException;
import com.sgp.erp.exception.DataNotSavedException;
import com.sgp.erp.model.Subject;

@Service
public class SubjectService {

    @Autowired
    private SubjectDao subjectDao;

    public ResponseEntity<ResponseStructure<Subject>> saveSubject(Subject subject) {
        Subject savedSubject = subjectDao.saveSubject(subject);
        ResponseStructure<Subject> structure = new ResponseStructure<>();
        structure.setData(savedSubject);
        structure.setMessage("Subject saved successfully");
        structure.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }

    public ResponseEntity<ResponseStructure<String>> deleteSubject(Integer subjectId) {
        subjectDao.deleteSubject(subjectId);
        ResponseStructure<String> structure = new ResponseStructure<>();
        structure.setData("Subject deleted successfully");
        structure.setMessage("Deleted successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    public ResponseEntity<ResponseStructure<List<Subject>>> findByDepartmentAndSemester(String department,
            Byte semester) {
        List<Subject> subjects = subjectDao.findByDepartmentAndSemester(department, semester);
        ResponseStructure<List<Subject>> structure = new ResponseStructure<List<Subject>>();

        try {
            structure.setData(subjects);
            structure.setMessage("Subjects found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Subject>>>(structure, HttpStatus.OK);
        } catch (Exception e) {
            throw new DataNotFoundException(
                    "No subjects found for department: " + department + " and semester: " + semester);
        }

    }

    public ResponseEntity<ResponseStructure<String>> uploadSubjectsCSV(MultipartFile subjectsFile) {
        Boolean subjects = subjectDao.uploadSubjectsCSV(subjectsFile);
        ResponseStructure<String> structure = new ResponseStructure<String>();
        if (subjects) {
            structure.setData("Subjects uploaded successfully");
            structure.setMessage("Subjects uploaded successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.CREATED);
        }
        throw new DataNotSavedException("Subjects not uploaded");
    }

}
