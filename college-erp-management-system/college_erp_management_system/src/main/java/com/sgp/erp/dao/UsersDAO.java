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

    public boolean login(String identifier, String password) {
        String finalId = identifier != null ? identifier.trim().toLowerCase() : "";
        System.out.println("Login attempt for identifier: [" + finalId + "]");

        // Find user by email OR registration number
        Optional<Users> userOpt = findByEmail(finalId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByRegistrationNumber(identifier);
        }

        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(finalId);

        if (userOpt.isEmpty()) {
            if (facultyOpt.isPresent()) {
                // Fix: User record is missing but faculty exists. Create the user record.
                Users newUser = new Users();
                newUser.setEmail(finalId);
                newUser.setRole(facultyOpt.get().getRole());
                newUser.setPassword(passwordEncoder.encode("459" + facultyOpt.get().getDepartment().toLowerCase()));
                userRepository.save(newUser);
                userOpt = Optional.of(newUser);
            } else {
                return false;
            }
        }

        Users user = userOpt.get();
        boolean matches = passwordEncoder.matches(password, user.getPassword());

        if (!matches && facultyOpt.isPresent()) {
            String expectedDefault = "459" + facultyOpt.get().getDepartment().toLowerCase();
            if (password.equals(expectedDefault)) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
                return true;
            }
        }

        return matches;
    }

    @Transactional
    public Faculty addUser(Faculty faculty) {
        String email = faculty.getEmail();
        if (userRepository.findByEmail(email).isPresent() || facultyRepository.findByEmail(email).isPresent()) {
            throw new com.sgp.erp.exception.UserDoesExistException("A user with this email already exists.");
        }

        try {
            Users users = new Users();
            users.setEmail(email);
            users.setRole(faculty.getRole());

            String department = faculty.getDepartment();
            if (department == null || department.trim().isEmpty()) {
                department = "PRINCIPAL";
                faculty.setDepartment(department);
            }

            users.setPassword(passwordEncoder.encode("459" + department.toLowerCase()));
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
