package com.sgp.erp.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		if (!username.equals("admin")) {
			throw new UsernameNotFoundException("User not found");
		}

		// 🔹 Encode password with BCrypt (only for testing)
		String encodedPassword = new BCryptPasswordEncoder().encode("admin123");
		System.out.println("Encoded Password: " + encodedPassword);

		return new User("admin", encodedPassword, Collections.emptyList());
	}
}
