package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<Users> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isEmpty()) {
            return "Invalid or expired token.";
        }

        Users user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword)); // Encrypt password
        user.setResetToken(null); // Clear reset token
        userRepository.save(user);

        return "Password updated successfully.";
    }
}
