package com.sgp.erp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.sgp.erp.model.Student;
import com.sgp.erp.model.Subject;
import com.sgp.erp.repository.SubjectRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private SubjectRepository subjectRepository;

    @Value("${sms.api.key:YOUR_API_KEY}")
    private String smsApiKey;

    @Value("${sms.sender.id:SGP}")
    private String smsSenderId;

    @Value("${sms.api.url:https://www.fast2sms.com/dev/bulkV2}")
    private String smsApiUrl;

    @Async
    public void sendAbsentSms(Student student, LocalDate date, Integer subjectId) {
        logger.info("→ Absent detected for student: {}", student.getName());
        
        try {
            // Check if API key is injected
            if ("YOUR_API_KEY".equals(smsApiKey) || smsApiKey == null || smsApiKey.trim().isEmpty()) {
                logger.warn("SMS API Key not injected (MOCK MODE). Message that would be sent: Dear Parent, this is SGP College. Your child {} was marked ABSENT on {} for a class.", student.getName(), date.toString());
                logger.info("→ MOCK SMS flow completed for {}. Register actual API key in application.properties to send real SMS.", student.getName());
                return;
            }

            // Retrieve Subject details
            String subjectName = "a class";
            if (subjectId != null) {
                Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
                if (subjectOpt.isPresent()) {
                    subjectName = subjectOpt.get().getSubjectName();
                }
            }

            // Retrieve Contact details
            String parentPhone = student.getParentPhone();
            logger.info("→ Parent number fetched for {}: {}", student.getName(), parentPhone);
            
            if (parentPhone == null || parentPhone.trim().isEmpty()) {
                logger.warn("No parent mobile number available for student: {}. SMS notification skipped.", student.getName());
                return;
            }

            // Ensure number format includes country code (+91 for India)
            String formattedPhone = parentPhone.trim().replaceAll("\\D", ""); // Remove non-digits
            if (formattedPhone.length() == 10) {
                formattedPhone = "+91" + formattedPhone;
            } else if (formattedPhone.length() == 12 && formattedPhone.startsWith("91")) {
                formattedPhone = "+" + formattedPhone;
            } else if (!formattedPhone.startsWith("+") && formattedPhone.length() > 0) {
                formattedPhone = "+" + formattedPhone;
            }
            
            logger.info("→ Formatted phone: {}", formattedPhone);

            String message = String.format(
                    "Dear Parent, this is SGP College. Your child %s was marked ABSENT on %s for %s. Please contact the college if required.",
                    student.getName(), date.toString(), subjectName);

            logger.info("→ Sending SMS from {}", smsSenderId);
            
            // Execute real SMS Gateway API call
            callSmsGateway(formattedPhone, message);

        } catch (Exception e) {
            logger.error("Critical error in NotificationService for student {}: {}", student.getName(), e.getMessage());
            e.printStackTrace();
        }
    }

    public boolean callSmsGateway(String phoneNumber, String message) {
        HttpURLConnection connection = null;
        try {
            String cleanPhone = phoneNumber.replaceAll("\\+", "");
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String urlStr = String.format("%s?authorization=%s&route=q&message=%s&flash=0&numbers=%s", 
                            smsApiUrl, smsApiKey, encodedMessage, cleanPhone);

            logger.info("→ Executing SMS API Request [URL: {}, SENDER: {}]", smsApiUrl, smsSenderId);
            
            URL url = new URL(urlStr);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            int responseCode = connection.getResponseCode();
            
            StringBuilder response = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(
                    responseCode >= 400 ? connection.getErrorStream() : connection.getInputStream()))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
            }

            logger.info("→ SMS API response received [Status: {}]: {}", responseCode, response.toString());

            if (responseCode >= 200 && responseCode < 300) {
                logger.info("→ SMS sent successfully to {} for student", phoneNumber);
                return true;
            } else {
                logger.error("→ SMS API rejection detected. Status: {}, Response: {}", responseCode, response.toString());
                return false;
            }

        } catch (Exception e) {
            logger.error("→ HTTP error/Exception during SMS sending: {}", e.getMessage());
            return false;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
}
