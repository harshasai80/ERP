package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Users;
import com.sgp.erp.repository.UserRepository;

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
    public ResponseEntity<ResponseStructure<String>> resetPassword(@RequestParam String email, @RequestParam String newPassword, @RequestParam String oldPassword) {
        Optional<Users> userOptional = userRepository.findByEmail(email);
        ResponseStructure<String> structure = new ResponseStructure<>();

        if (userOptional.isEmpty()) {
            structure.setData(null);
            structure.setMessage("Invalid or expired token");
            structure.setStatus(HttpStatus.BAD_REQUEST.value());
            return new ResponseEntity<>(structure, HttpStatus.BAD_REQUEST);
        }

        Users user = userOptional.get();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {    
            structure.setData(null);
            structure.setMessage("Invalid old password");
            structure.setStatus(HttpStatus.BAD_REQUEST.value());            
            return new ResponseEntity<>(structure, HttpStatus.BAD_REQUEST);
        }
        
        user.setPassword(passwordEncoder.encode(newPassword)); // Encrypt password
        user.setResetToken(null); // Clear reset token
        userRepository.save(user);

        structure.setData(null);
        structure.setMessage("Password Reset Successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

}
