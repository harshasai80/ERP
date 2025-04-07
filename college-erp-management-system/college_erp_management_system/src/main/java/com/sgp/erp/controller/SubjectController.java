package com.sgp.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Subject;
import com.sgp.erp.service.SubjectService;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RequestMapping("/subjects")

public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping("/add")
    public ResponseEntity<ResponseStructure<Subject>> saveSubject(@RequestBody Subject subject) {
        return subjectService.saveSubject(subject);
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<ResponseStructure<String>> deleteSubject(@PathVariable Integer subjectId) {
        return subjectService.deleteSubject(subjectId);
    }

    @GetMapping("/department/{department}/semester/{semester}")
    public ResponseEntity<ResponseStructure<List<Subject>>> findByDepartmentAndSemester(@PathVariable String department,
            @PathVariable Byte semester) {
        return subjectService.findByDepartmentAndSemester(department, semester);
    }

    @GetMapping("/upload")
    public ResponseEntity<ResponseStructure<String>> uploadSubjectsCSV(@RequestParam("file") MultipartFile file) {
        return subjectService.uploadSubjectsCSV(file);
    }
}
