package com.sgp.erp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendAccountCreationEmail(String email, String password) throws MessagingException {
        String loginLink = "http://103.44.2.245:3000/role-based-login"; // Change to your actual frontend login URL
        String subject = "Welcome to SGP ERP - Your Account Details";

        // HTML message
        String message = """
                <div style='font-family:Arial,sans-serif;line-height:1.6;'>
                    <h2>Welcome to SGP ERP 🎉</h2>
                    <p>Your account has been successfully created. Below are your login credentials:</p>
                    <p><b>Username:</b> %s</p>
                    <p><b>Password:</b> %s</p>

                    <p>Click the button below to log in:</p>
                    <a href='%s'
                        style='background-color:#28a745;color:white;padding:10px 20px;
                        text-decoration:none;font-size:16px;border-radius:5px;display:inline-block;'>
                        Go to Login
                    </a>

                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p><a href='%s'>%s</a></p>

                    <hr/>
                    <p style='font-size:12px;color:gray;'>This is an automated email. Please do not reply.</p>
                </div>
                """.formatted(email, password, loginLink, loginLink, loginLink);

        // Prepare MimeMessage
        MimeMessage mailMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true);
        helper.setFrom(fromEmail); // use the configured sender email
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(message, true); // HTML enabled

        mailSender.send(mailMessage);
    }

    public void sendIAUpdateEmail(String email, String studentName, String subjectName, String iaType, String marks)
            throws MessagingException {
        String subject = "IA Marks Published - " + subjectName;
        String message = """
                <div style='font-family:Arial,sans-serif;line-height:1.6;'>
                    <h2>IA Marks Notification 📝</h2>
                    <p>Dear Parent/Student,</p>
                    <p>Internal Assessment marks for <b>%s</b> have been published for <b>%s</b>.</p>
                    <p><b>Assessment:</b> %s</p>
                    <p><b>Marks Obtained:</b> %s</p>
                    <p>Log in to the portal to view detailed performance analytics.</p>
                    <hr/>
                    <p style='font-size:12px;color:gray;'>This is an automated performance update from SGP ERP.</p>
                </div>
                """.formatted(studentName, subjectName, iaType, marks);

        MimeMessage mailMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true);
        helper.setFrom(fromEmail);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(message, true);
        mailSender.send(mailMessage);
    }
}
