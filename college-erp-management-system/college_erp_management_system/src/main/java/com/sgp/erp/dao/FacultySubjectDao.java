package com.sgp.erp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.FacultySubject;
import com.sgp.erp.repository.FacultySubjectRepository;

@Repository
public class FacultySubjectDao {
    @Autowired
    private FacultySubjectRepository facultySubjectRepository;

    public Optional<List<FacultySubject>> findByFacultyId(Long facultyId) {
        return facultySubjectRepository.findByFacultyId(facultyId);
    }
}
