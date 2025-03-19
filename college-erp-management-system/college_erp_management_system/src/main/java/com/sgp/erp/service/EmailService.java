package com.sgp.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sgp.erp.dao.EmailDao;

@Service
public class EmailService {

    @Autowired
    private EmailDao emailDAO;

    public void sendPasswordResetEmail(String email, String token) {
        String resetUrl = "http://your-frontend-url/reset-password?token=" + token;
        String message = "Click the link to reset your password: " + resetUrl;

        emailDAO.sendEmail(email, "Password Reset", message);
    }
}
