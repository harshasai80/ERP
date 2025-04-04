package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Users;
import com.sgp.erp.repository.UserRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RequestMapping("/auth")
public class PasswordResetController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseStructure<String>> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<Users> userOptional = userRepository.findByResetToken(token);
        ResponseStructure<String> structure = new ResponseStructure<>();

        if (userOptional.isEmpty()) {
            structure.setData(null);
            structure.setMessage("Invalid or expired token");
            structure.setStatus(HttpStatus.BAD_REQUEST.value());
            // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or expired token"));
            return new ResponseEntity<>(structure, HttpStatus.BAD_REQUEST);
        }

        Users user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword)); // Encrypt password
        user.setResetToken(null); // Clear reset token
        userRepository.save(user);

        structure.setData(null);
        structure.setMessage("Password Reset Successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

}
