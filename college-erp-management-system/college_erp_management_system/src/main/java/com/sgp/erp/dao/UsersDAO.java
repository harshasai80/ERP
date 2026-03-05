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
        String finalEmail = email != null ? email.trim().toLowerCase() : "";
        System.out.println("Login attempt for email: [" + finalEmail + "]");

        Optional<Users> userOpt = findByEmail(finalEmail);
        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(finalEmail);

        if (userOpt.isEmpty()) {
            if (facultyOpt.isPresent()) {
                // Fix: User record is missing but faculty exists. Create the user record.
                System.out.println(
                        "DEBUG: Faculty exists but User record missing for " + finalEmail + ". Creating default user.");
                Users newUser = new Users();
                newUser.setEmail(finalEmail);
                newUser.setPassword(passwordEncoder.encode("459" + facultyOpt.get().getDepartment().toLowerCase()));
                userRepository.save(newUser);
                userOpt = Optional.of(newUser);
            } else {
                System.out.println("DEBUG: No User or Faculty record found for " + finalEmail);
                return false;
            }
        }

        Users user = userOpt.get();
        boolean matches = passwordEncoder.matches(password, user.getPassword());

        if (!matches && facultyOpt.isPresent()) {
            // Fallback: Check if the provided password matches the default pattern for this
            // department
            String expectedDefault = "459" + facultyOpt.get().getDepartment().toLowerCase();
            if (password.equals(expectedDefault)) {
                System.out.println("DEBUG: Fallback to default password pattern successful for " + finalEmail);
                // Update the user record with the correctly encoded default password for future
                // use
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
                return true;
            }
        }

        if (!matches) {
            System.out.println("Login failed: password mismatch for " + finalEmail);
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
