package com.sgp.erp.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Users;
import com.sgp.erp.repository.UserRepository;

@Repository
public class UsersDAO {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        System.out.println("Searching for user with email: " + email);
        Optional<Users> user = findByEmail(email);

        if (user.isEmpty()) {
            System.out.println("User not found");
            return false; // No user found
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            return false;
        }

        return true;
    }

}
