package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgp.erp.service.NotificationService;

@RestController
@RequestMapping("/api")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/test-sms")
    public ResponseEntity<String> testSms(@RequestParam String phone) {
        String testMessage = "Test SMS from SGP College. Gateway integration check.";
        boolean success = notificationService.callSmsGateway(phone, testMessage);
        
        if (success) {
            return ResponseEntity.ok("SMS API call triggered. Check backend logs for status.");
        } else {
            return ResponseEntity.status(500).body("SMS API call failed. Check backend logs for details.");
        }
    }
}
