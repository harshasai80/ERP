package com.sgp.erp.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.IAMarks;
import com.sgp.erp.repository.IAMarksRepository;

@Repository
public class IAMarksDao {

    @Autowired
    private IAMarksRepository iaMarksRepository;

    public List<IAMarks> getByRegistrationNumber(String registrationNumber) {
        return iaMarksRepository.findByRegistrationNumber(registrationNumber);
    }

    public List<IAMarks> getByRegistrationNumberAndSubject(String registrationNumber, String subjectName) {
        return iaMarksRepository.findByRegistrationNumberAndSubjectName(registrationNumber, subjectName);
    }

    public IAMarks saveIAMarks(IAMarks iaMarks) {
        return iaMarksRepository.save(iaMarks);
    }

    public void deleteIAMarks(Long id) {
        iaMarksRepository.deleteById(id);
    }

    public List<IAMarks> getByFilter(String dept, byte sem, com.sgp.erp.model.enums.Section section, Integer subjectId) {
        return iaMarksRepository.findByFilter(dept, sem, section, subjectId);
    }

    public List<IAMarks> getByClass(String dept, byte sem, com.sgp.erp.model.enums.Section section) {
        return iaMarksRepository.findByClass(dept, sem, section);
    }
}
