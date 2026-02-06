package com.sgp.erp.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Optional;
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
import com.sgp.erp.exception.UserNotDeletedException;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Users;
import com.sgp.erp.model.enums.Roles;
import com.sgp.erp.repository.FacultyRepository;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class UsersService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private UsersDAO usersDAO;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void uploadFacultyCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

            String[] nextRecord;
            csvReader.skip(5); // Skip header row
            while ((nextRecord = csvReader.readNext()) != null) {
                if (nextRecord.length < 4) {
                    throw new RuntimeException("Insufficient fields in CSV file. Expected at least 4 fields.");
                }
                String name = nextRecord[0];
                String email = nextRecord[1];
                String department = nextRecord[2];
                String roleStr = nextRecord[3];

                Roles role;
                try {
                    role = Roles.valueOf(roleStr.toUpperCase()); // Convert string to enum
                    System.out.println("Role: " + role);
                } catch (IllegalArgumentException e) {
                    System.err.println(e.getMessage());
                    throw new RuntimeException("Invalid role in CSV: " + roleStr);
                }

                Users users = new Users();
                users.setEmail(email);
                users.setPassword(passwordEncoder.encode("459" + department.toLowerCase()));
                // users.setResetToken(UUID.randomUUID().toString());

                usersDAO.save(users);

                Faculty faculty = new Faculty();
                faculty.setName(name);
                faculty.setEmail(email);
                faculty.setDepartment(department.toUpperCase());
                faculty.setRole(role);

                facultyRepository.save(faculty);
                emailService.sendAccountCreationEmail(users.getEmail(), "459" + faculty.getDepartment().toLowerCase());
            }
            System.out.println("csv file uploaded");

        } catch (IOException | CsvValidationException e) {
            System.out.println("Failed to process CSV file: " + e.getMessage());
            throw new RuntimeException("Failed to process CSV file.");
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send account creation email.");
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
            Optional<Faculty> faculty = facultyRepository.findByEmail(email);
            if (faculty.isPresent()) {
                structure.setData(faculty.get());
                structure.setMessage("Login successfully");
                structure.setStatus(HttpStatus.OK.value());
                return new ResponseEntity<ResponseStructure<Faculty>>(structure, HttpStatus.OK);
            } else {
                throw new InvalidCredentials("User account found but faculty profile missing.");
            }
        }

        throw new InvalidCredentials();
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> deleteUser(String email) {
        ResponseStructure<String> structure = new ResponseStructure<String>();
        boolean res = usersDAO.deleteUser(email);
        if (res) {
            structure.setData("User Deleted successfully");
            structure.setMessage("User Deleted successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.OK);
        }
        throw new UserNotDeletedException();
    }
}
