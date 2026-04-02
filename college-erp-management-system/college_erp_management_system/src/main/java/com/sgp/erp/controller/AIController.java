package com.sgp.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgp.erp.dto.AIInsightDTO;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.service.AIIntegrationService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = { "http://localhost:3000", "http://103.44.2.245:3000" })
public class AIController {

    @Autowired
    private AIIntegrationService aiService;

    @GetMapping("/student-risk")
    public ResponseEntity<ResponseStructure<AIInsightDTO>> getStudentRisk(
            @RequestParam(name = "registrationNumber") String registrationNumber) {
        
        AIInsightDTO insight = aiService.getStudentRiskInsight(registrationNumber);
        
        ResponseStructure<AIInsightDTO> structure = new ResponseStructure<>();
        if (insight != null) {
            structure.setData(insight);
            structure.setMessage("AI Insights retrieved successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<>(structure, HttpStatus.OK);
        } else {
            structure.setData(null);
            structure.setMessage("Student not found for AI analysis");
            structure.setStatus(HttpStatus.NOT_FOUND.value());
            return new ResponseEntity<>(structure, HttpStatus.NOT_FOUND);
        }
    }
}
