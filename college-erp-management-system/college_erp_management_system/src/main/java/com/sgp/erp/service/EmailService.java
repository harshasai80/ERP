package com.sgp.erp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String email, String resetToken) throws MessagingException {
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        String subject = "Set Your Account Password";

        // HTML message with button
        String message = """
                <div style='font-family:Arial,sans-serif;line-height:1.6;'>
                    <h3>Password Reset Request</h3>
                    <p>Click the button below to set your password:</p>
                    <a href='%s'
                        style='background-color:#007BFF;color:white;padding:10px 20px;
                        text-decoration:none;font-size:16px;border-radius:5px;display:inline-block;'>
                        Set Password
                    </a>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p><a href='%s'>%s</a></p>
                </div>
                """.formatted(resetLink, resetLink, resetLink);

        // Use MimeMessage to send HTML email
        MimeMessage mailMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(message, true); // Enable HTML content

        mailSender.send(mailMessage);
    }
}
