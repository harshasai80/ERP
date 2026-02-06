package com.sgp.erp.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Users;
import com.sgp.erp.repository.FacultyRepository;
import com.sgp.erp.repository.UserRepository;
import com.sgp.erp.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Repository
public class UsersDAO {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public Users save(Users user) {
        return userRepository.save(user);
    }

    public Optional<Users> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<Users> findByResetToken(String token) {
        return userRepository.findByResetToken(token);
    }

    public boolean login(String email, String password) {
        System.out.println("Login attempt for email: [" + email + "]");
        Optional<Users> user = findByEmail(email);

        if (user.isEmpty()) {
            System.out.println("DEBUG: User not found in database for email: [" + email + "]");
            return false;
        }

        boolean matches = passwordEncoder.matches(password, user.get().getPassword());

        if (!matches) {
            System.out.println("Login failed: password mismatch for " + email);
        }

        return matches;
    }

    @Transactional
    public Faculty addUser(Faculty faculty) {
        try {
            Users users = new Users();
            users.setEmail(faculty.getEmail());

            String department = faculty.getDepartment();
            if (department == null || department.trim().isEmpty()) {
                department = "PRINCIPAL";
                faculty.setDepartment(department);
            }

            users.setPassword(passwordEncoder.encode("459" + department.toLowerCase()));
            // users.setResetToken(UUID.randomUUID().toString());

            userRepository.save(users);

            facultyRepository.save(faculty);
            emailService.sendAccountCreationEmail(users.getEmail(), "459" + department.toLowerCase());

            return faculty;

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send account creation email.");
        }
    }

    public boolean deleteUser(String email) {
        Integer result = userRepository.deleteByEmail(email);
        return result > 0; // Returns true if at least one record was deleted
    }

}
