package com.sgp.erp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @Column(name = "value", nullable = false)
    private String value;

    @Column(name = "semester", nullable = false)
    private Byte semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "section", nullable = false)
    private Section section;

    @Column(name = "max_marks", nullable = false)
    private int maxMarks;

    @Column(name = "subject_batches")
    private String[] subjectBatches;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

}

enum SubjectType {
    THEORY,
    PRACTICAL
}