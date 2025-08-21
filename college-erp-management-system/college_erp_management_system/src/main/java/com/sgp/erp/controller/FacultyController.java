package com.sgp.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity<String> uploadFacultyData(@RequestParam MultipartFile file) {
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

    @GetMapping("/all")
    public ResponseEntity<ResponseStructure<List<Faculty>>> getAllFaculties(@RequestParam String department) {
        return facultyService.getAllFaculties(department);
    }

    @GetMapping("/email")
    public ResponseEntity<ResponseStructure<Faculty>> getFacultyByEmail(@RequestParam String email) {
        return facultyService.getFacultyByEmail(email);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseStructure<Faculty>> updateFaculty(@RequestParam String email, @RequestBody Faculty faculty) {
        return facultyService.updateFaculty(email, faculty);
    }

    @GetMapping("/all-faculties")
    public ResponseEntity<ResponseStructure<List<Faculty>>> getAllFaculties() {
        return facultyService.getAllFaculties();
    }

}
