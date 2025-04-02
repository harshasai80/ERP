package com.sgp.erp.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
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
}
