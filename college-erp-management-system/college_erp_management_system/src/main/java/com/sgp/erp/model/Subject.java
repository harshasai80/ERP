package com.sgp.erp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false)
    private SubjectType subjectType;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "semester", nullable = false)
    private Byte semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "section", nullable = false)
    private Section section;

    @Column(name = "subject_batches")
    private String[] subjectBatches;

}

enum SubjectType {
    THEORY,
    PRACTICAL
}