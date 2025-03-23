
package com.sgp.erp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ia_marks", indexes = { @Index(name = "idx_student_subject", columnList = "student_id, subject_id") })
@Data
public class IAMarks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(columnDefinition = "json", nullable = false)
    private String iaMarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Department dept;
}

enum Department {
    DCS, DME, DEEE, DCE, DMT
}
