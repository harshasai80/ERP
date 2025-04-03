package com.sgp.erp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.FacultySubject;
import com.sgp.erp.model.Subject;
import com.sgp.erp.repository.FacultyRepository;
import com.sgp.erp.repository.SubjectRepository;

@Repository
public class FacultyDao {
    
    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public Optional<Faculty> findByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }

    public void assignSubject(FacultySubject facultySubject) {

        

    }

}
