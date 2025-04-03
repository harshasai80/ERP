package com.sgp.erp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "attendance", indexes = { @Index(name = "idx_student_date", columnList = "student_id, attendance_date") })
public class Attendance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "student_id", nullable = false)
	private Student student;

	@Column(name = "attendance_date", nullable = false)
	private LocalDate attendanceDate;

	@Column(columnDefinition = "JSON", nullable = false)
	private String sessions;

}
