package com.sgp.erp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sgp.erp.dao.FacultySubjectDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.DataNotFoundException;
import com.sgp.erp.model.FacultySubject;

@Service
public class FacultySubjectService {

    @Autowired
    private FacultySubjectDao facultySubjectDao;

    public ResponseEntity<ResponseStructure<List<FacultySubject>>> findByFacultyId(Long facultyId) {
        ResponseStructure<List<FacultySubject>> structure = new ResponseStructure<List<FacultySubject>>();
        Optional<List<FacultySubject>> facultySubjects = facultySubjectDao.findByFacultyId(facultyId);
        if (facultySubjects.isPresent()) {
            structure.setData(facultySubjects.get());
            structure.setMessage("Subjects found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<FacultySubject>>>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException();
    }
}