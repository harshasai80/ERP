package com.sgp.erp.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Faculty;
import com.sgp.erp.repository.FacultyRepository;

@Repository
public class FacultyDao {
    
    @Autowired
    private FacultyRepository facultyRepository;

    public Optional<Faculty> findByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }

}
