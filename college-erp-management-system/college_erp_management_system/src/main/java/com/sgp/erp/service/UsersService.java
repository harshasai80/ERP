package com.sgp.erp.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
// import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.sgp.erp.dao.UsersDAO;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.InvalidCredentials;
import com.sgp.erp.exception.UserDoesExistException;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Users;
import com.sgp.erp.model.enums.Roles;
import com.sgp.erp.repository.FacultyRepository;

// import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class UsersService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private UsersDAO usersDAO;

    // @Autowired
    // private EmailService emailService;

    @Transactional
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
                users.setEmail(email);
                System.out.println("459" + department.toLowerCase());
                users.setPassword(passwordEncoder.encode("459" + department.toLowerCase()));
                // users.setResetToken(UUID.randomUUID().toString());

                usersDAO.save(users);

                Faculty faculty = new Faculty();
                faculty.setName(name);
                faculty.setEmail(email);
                faculty.setDepartment(department);
                faculty.setRole(role);

                facultyRepository.save(faculty);
                // emailService.sendPasswordResetEmail(users.getEmail(), users.getResetToken());
            }
            System.out.println("csv file uploaded");

        } catch (IOException | CsvValidationException e) {
            System.out.println("Failed to process CSV file: " + e.getMessage());
            throw new RuntimeException("Failed to process CSV file.");
            // } catch (MessagingException e) {
            // throw new RuntimeException("Failed to send password reset email.");
        }
    }

    public ResponseEntity<ResponseStructure<Faculty>> addUser(Faculty faculty) {
        ResponseStructure<Faculty> structure = new ResponseStructure<Faculty>();
        Faculty res = usersDAO.addUser(faculty);

        if (res != null) {
            structure.setData(res);
            structure.setMessage("User added successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<Faculty>>(structure, HttpStatus.CREATED);
        }
        throw new UserDoesExistException();
    }

    public ResponseEntity<ResponseStructure<Faculty>> login(String email, String password) {
        ResponseStructure<Faculty> structure = new ResponseStructure<Faculty>();
        boolean res = usersDAO.login(email, password);
        if (res) {
            structure.setData(facultyRepository.findByEmail(email).get());
            structure.setMessage("Login successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<Faculty>>(structure, HttpStatus.OK);
        }

        throw new InvalidCredentials();
    }
}
