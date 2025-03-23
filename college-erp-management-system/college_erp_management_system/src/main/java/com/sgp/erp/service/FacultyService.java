package com.sgp.erp.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.sgp.erp.dao.FacultyDao;
import com.sgp.erp.model.Faculty;
import com.sgp.erp.model.Roles;

import jakarta.mail.MessagingException;

@Service
public class FacultyService {

    @Autowired
    private FacultyDao facultyDAO;

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

                Faculty faculty = new Faculty();
                faculty.setName(name);
                faculty.setEmail(email);
                faculty.setDepartment(department);
                faculty.setRole(role);
                faculty.setPassword(null);
                faculty.setResetToken(UUID.randomUUID().toString());

                facultyDAO.save(faculty);
                emailService.sendPasswordResetEmail(faculty.getEmail(), faculty.getResetToken());
            }

        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to process CSV file.");
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email.");
        }
    }

    public Optional<Faculty> findByEmail(String email) {
        return facultyDAO.findByEmail(email);
    }
}
