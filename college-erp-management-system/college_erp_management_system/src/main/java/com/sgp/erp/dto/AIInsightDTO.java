package com.sgp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightDTO {
    private String studentId;
    private double riskScore; // 0.0 to 1.0
    private String riskLevel; // LOW, MEDIUM, HIGH
    private String predictedGrade;
    private List<String> keyFactors; // Reasons for the prediction
    private String recommendation;
    private Map<String, Object> additionalMetrics;
}
