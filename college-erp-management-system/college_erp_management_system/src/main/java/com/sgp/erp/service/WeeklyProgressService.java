package com.sgp.erp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.WeeklyProgress;
import com.sgp.erp.repository.WeeklyProgressRepository;

@Service
public class WeeklyProgressService {

    @Autowired
    private WeeklyProgressRepository repository;

    public ResponseEntity<ResponseStructure<WeeklyProgress>> addProgress(WeeklyProgress progress) {
        WeeklyProgress saved = repository.save(progress);
        ResponseStructure<WeeklyProgress> structure = new ResponseStructure<>();
        structure.setData(saved);
        structure.setMessage("Weekly progress added successfully");
        structure.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }

    public ResponseEntity<ResponseStructure<List<WeeklyProgress>>> getProgressBySubject(Long facultySubjectId) {
        List<WeeklyProgress> list = repository.findByFacultySubjectIdOrderByWeekNumber(facultySubjectId);
        ResponseStructure<List<WeeklyProgress>> structure = new ResponseStructure<>();
        structure.setData(list);
        structure.setMessage("Weekly progress fetched successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }
}
