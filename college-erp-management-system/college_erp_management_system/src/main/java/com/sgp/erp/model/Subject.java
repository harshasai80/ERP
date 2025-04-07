package com.sgp.erp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "subject")
@Data
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer subjectId;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "subject_code", nullable = false)
    private String subjectCode;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "value", nullable = false)
    private int value;

    @Column(name = "semester", nullable = false)
    private Byte semester;

    @Column(name = "max_marks", nullable = false)
    private int maxMarks;
}

enum SubjectType {
    THEORY,
    PRACTICAL
}