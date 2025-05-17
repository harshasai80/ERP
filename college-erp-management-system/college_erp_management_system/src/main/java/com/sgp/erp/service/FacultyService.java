package com.sgp.erp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sgp.erp.dao.FacultyDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.FacultyNotFoundException;
import com.sgp.erp.exception.SubjectNotAssignedException;
import com.sgp.erp.model.Faculty;
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

    public ResponseEntity<ResponseStructure<List<Faculty>>> getAllFaculties(String department) {
        ResponseStructure<List<Faculty>> structure = new ResponseStructure<List<Faculty>>();
        Optional<List<Faculty>> faculties = facultyDao.findByDepartment(department);
        if (faculties.isPresent()) {
            structure.setData(faculties.get());
            structure.setMessage("Faculties found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Faculty>>>(structure, HttpStatus.OK);
        }
        throw new FacultyNotFoundException();
    }

    public ResponseEntity<ResponseStructure<Faculty>> updateFaculty(String email, Faculty faculty) {
        ResponseStructure<Faculty> structure = new ResponseStructure<Faculty>();
        Faculty updatedFaculty = facultyDao.update(email, faculty);
        if (updatedFaculty != null) {
            structure.setData(updatedFaculty);
            structure.setMessage("Faculty updated successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<Faculty>>(structure, HttpStatus.OK);
        }
        throw new FacultyNotFoundException();
    }

    public ResponseEntity<ResponseStructure<Faculty>> getFacultyByEmail(String email) {
        ResponseStructure<Faculty> structure = new ResponseStructure<Faculty>();
        Optional<Faculty> faculty = facultyDao.findByEmail(email);
        if (faculty.isPresent()) {
            structure.setData(faculty.get());
            structure.setMessage("Faculty found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<Faculty>>(structure, HttpStatus.OK);
        }
        throw new FacultyNotFoundException();
    }

}
