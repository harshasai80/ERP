package com.sgp.erp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.sgp.erp.dao.StudentDao;
import com.sgp.erp.dto.AIInsightDTO;
import com.sgp.erp.model.Student;

import lombok.extern.slf4j.Slf4j;

/**
 * AIIntegrationService handles the communication between the Spring Boot ERP 
 * and the external AI Service (FastAPI/Python). 
 * It also provides fallback deterministic logic for initial deployment.
 */
@Service
@Slf4j
public class AIIntegrationService {

    @Autowired
    private StudentDao studentDao;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_SERVICE_URL = "http://localhost:8000/api/predict";

    /**
     * Get predictive insights for a specific student.
     */
    public AIInsightDTO getStudentRiskInsight(String registrationNumber) {
        Optional<Student> studentOpt = studentDao.findByRegistrationNumber(registrationNumber);
        
        if (studentOpt.isEmpty()) {
            return null;
        }

        Student student = studentOpt.get();
        
        try {
            // Attempt to fetch from real AI Service
            // return restTemplate.getForObject(AI_SERVICE_URL + "/risk/" + registrationNumber, AIInsightDTO.class);
            return generateHeuristicInsight(student);
        } catch (Exception e) {
            log.error("AI Service unavailable, falling back to heuristics: {}", e.getMessage());
            return generateHeuristicInsight(student);
        }
    }

    /**
     * Provides a deterministic 'Smart' insight based on current data.
     * This acts as the logic layer until the ML models are fully trained and integrated.
     */
    private AIInsightDTO generateHeuristicInsight(Student student) {
        List<String> factors = new ArrayList<>();
        double riskScore = 0.2; // Start with baseline low risk
        
        // Mock attendance logic (assuming we'd fetch real attendance stats here)
        // For demonstration, we use a simple heuristic based on available data
        
        // Example factors:
        if (student.getSem() > 4) {
             factors.add("Higher semester academic load");
             riskScore += 0.1;
        }

        String riskLevel = "LOW";
        if (riskScore > 0.7) riskLevel = "HIGH";
        else if (riskScore > 0.4) riskLevel = "MEDIUM";

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("data_confidence", 0.85);
        metrics.put("last_updated", System.currentTimeMillis());

        return AIInsightDTO.builder()
                .studentId(student.getRegistrationNumber())
                .riskScore(riskScore)
                .riskLevel(riskLevel)
                .predictedGrade("A") // Mock prediction
                .keyFactors(factors)
                .recommendation("Maintain 85%+ attendance for optimal performance.")
                .additionalMetrics(metrics)
                .build();
    }
}
