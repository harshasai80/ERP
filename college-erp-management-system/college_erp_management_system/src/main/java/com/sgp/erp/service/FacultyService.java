package com.sgp.erp.service;

import java.security.DrbgParameters.Reseed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sgp.erp.dao.FacultyDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.SubjectNotAssignedException;
import com.sgp.erp.model.FacultySubject;

@Service
public class FacultyService {

    @Autowired
    private FacultyDao facultyDao;

    public ResponseEntity<ResponseStructure<FacultySubject>> assignSubject(FacultySubject facultySubject) {
        ResponseStructure<FacultySubject> structure = new ResponseStructure<FacultySubject>();
        Boolean subject = facultyDao.assignSubject(facultySubject);
        if (subject) {
            structure.setData(facultySubject);
            structure.setMessage("Subject assigned successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<FacultySubject>>(structure, HttpStatus.CREATED);
        }
        throw new SubjectNotAssignedException();
    }
}
