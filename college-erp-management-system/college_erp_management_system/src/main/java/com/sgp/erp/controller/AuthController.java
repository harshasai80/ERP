package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.model.Users;
import com.sgp.erp.service.UsersService;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	private UsersService usersService;

	@PostMapping("/login")
	public ResponseEntity<ResponseStructure<Users>> login(@RequestParam String email, @RequestParam String password) {
		return usersService.login(email, password);
	}
}