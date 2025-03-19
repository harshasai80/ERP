package com.sgp.erp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Roles;
import com.sgp.erp.repository.FacultyRepository;

@Repository
public class FacultyDao {
    @Autowired
    private FacultyRepository facultyRepository;

    public Faculty save(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public Optional<Faculty> findByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }

    public Optional<Faculty> findByResetToken(String token) {
        return facultyRepository.findByResetToken(token);
    }

    public List<Faculty> findByRole(Roles role) {
        return facultyRepository.findByRole(role);
    }

}
