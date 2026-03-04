package com.sgp.erp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "weekly_progress")
@Data
public class WeeklyProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_subject_id", nullable = false)
    private FacultySubject facultySubject;

    @Column(name = "week_number", nullable = false)
    private int weekNumber;

    @Column(name = "topics_covered", nullable = false)
    private String topicsCovered;

    @Column(name = "completion_percentage", nullable = false)
    private double completionPercentage;
}
