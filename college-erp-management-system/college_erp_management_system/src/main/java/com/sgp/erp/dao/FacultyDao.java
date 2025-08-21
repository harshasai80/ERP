package com.sgp.erp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.FacultySubject;
import com.sgp.erp.repository.FacultyRepository;
import com.sgp.erp.repository.FacultySubjectRepository;

@Repository
public class FacultyDao {

    @Autowired
    private FacultySubjectRepository facultySubjectRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public Optional<Faculty> findByEmail(String email) {
        return facultyRepository.findByEmail(email);
    }

    public Boolean assignSubject(FacultySubject facultySubject) {
        facultySubjectRepository.save(facultySubject);
        return true;
    }

    public Optional<List<Faculty>> findByDepartment(String department) {
        return facultyRepository.findByDepartment(department);
    }

    public Faculty update(String email, Faculty faculty) {
        Optional<Faculty> existingFaculty = facultyRepository.findByEmail(email);
        if (existingFaculty.isPresent()) {
            Faculty updateExistingFaculty = existingFaculty.get();

            updateExistingFaculty.setName(faculty.getName());
            updateExistingFaculty.setDepartment(faculty.getDepartment());
            updateExistingFaculty.setRole(faculty.getRole());
            updateExistingFaculty.setEmail(faculty.getEmail());
            return facultyRepository.save(updateExistingFaculty);
        }
        return null;
    }
}
