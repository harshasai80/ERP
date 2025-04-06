package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.FacultySubject;
import com.sgp.erp.service.FacultyService;
import com.sgp.erp.service.UsersService;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private UsersService userService;

    @Autowired
    private FacultyService facultyService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFacultyData(@RequestParam("file") MultipartFile file) {
        try {
            userService.uploadFacultyCSV(file);
            return ResponseEntity.ok("Faculty data uploaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading faculty data: " + e.getMessage());
        }
    }

    @PostMapping("/assign-subject")
    public ResponseEntity<ResponseStructure<FacultySubject>> assignSubject(@RequestBody FacultySubject facultySubject) {
        return facultyService.assignSubject(facultySubject);
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseStructure<Faculty>> addFaculty(@RequestBody Faculty faculty) {
        return userService.addUser(faculty);
    }

}
