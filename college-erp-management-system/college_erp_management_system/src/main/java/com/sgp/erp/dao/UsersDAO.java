package com.sgp.erp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.sgp.erp.model.Roles;
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

    public List<Users> findByRole(Roles role) {
        return userRepository.findByRole(role);
    }

    public boolean login(String email, String password) {
		Optional<Users> user = userRepository.findByEmail(email);

		if (!passwordEncoder.matches(password, user.get().getPassword())) {
			return false;
		}

		return true;
	}

}
