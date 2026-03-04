package com.sgp.erp.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.WeeklyProgress;
import com.sgp.erp.service.WeeklyProgressService;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class WeeklyProgressController {

    @Autowired
    private WeeklyProgressService service;

    @PostMapping("/add")
    public ResponseEntity<ResponseStructure<WeeklyProgress>> addProgress(@RequestBody WeeklyProgress progress) {
        return service.addProgress(progress);
    }

    @GetMapping("/subject/{facultySubjectId}")
    public ResponseEntity<ResponseStructure<List<WeeklyProgress>>> getProgress(
            @PathVariable(name = "facultySubjectId") Long facultySubjectId) {
        return service.getProgressBySubject(facultySubjectId);
    }
}
