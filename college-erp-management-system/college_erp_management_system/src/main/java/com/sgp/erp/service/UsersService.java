package com.sgp.erp.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.sgp.erp.dao.UsersDAO;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.InvalidCredentials;
import com.sgp.erp.model.Roles;
import com.sgp.erp.model.Users;

import jakarta.mail.MessagingException;

@Service
public class UsersService {

    @Autowired
    private UsersDAO usersDAO;

    @Autowired
    private EmailService emailService;

    public void uploadFacultyCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

            String[] nextRecord;
            csvReader.readNext(); // Skip header row

            while ((nextRecord = csvReader.readNext()) != null) {
                String name = nextRecord[0];
                String email = nextRecord[1];
                String department = nextRecord[2];
                String roleStr = nextRecord[3];

                Roles role;
                try {
                    role = Roles.valueOf(roleStr.toUpperCase()); // Convert string to enum
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid role in CSV: " + roleStr);
                }

                Users users = new Users();
                users.setName(name);
                users.setEmail(email);
                users.setDepartment(department);
                users.setRole(role);
                users.setPassword(null);
                users.setResetToken(UUID.randomUUID().toString());

                usersDAO.save(users);
                emailService.sendPasswordResetEmail(users.getEmail(), users.getResetToken());
            }

        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to process CSV file.");
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email.");
        }
    }

    public ResponseEntity<ResponseStructure<Users>> login(String email, String password) {
        ResponseStructure<Users> structure = new ResponseStructure<Users>();
        boolean res = usersDAO.login(email, password);
        if (res) {
            structure.setData(usersDAO.findByEmail(email).get());
            structure.setMessage("Login successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<Users>>(structure, HttpStatus.OK);
        }

        throw new InvalidCredentials();
    }
}
