package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.sgp.erp.model.Faculty;
import com.sgp.erp.repository.FacultyRepository;

import java.util.Optional;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RequestMapping("/auth")
public class PasswordResetController {
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<Faculty> facultyOptional = facultyRepository.findByResetToken(token);

        if (facultyOptional.isEmpty()) {
            return "Invalid or expired token.";
        }

        Faculty faculty = facultyOptional.get();
        faculty.setPassword(passwordEncoder.encode(newPassword)); // Encrypt password
        faculty.setResetToken(null); // Clear reset token
        facultyRepository.save(faculty);

        return "Password updated successfully.";
    }
}
