package com.sgp.erp.model;

import com.sgp.erp.model.enums.Section;

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
@Table(name = "students")
@Data
public class Student {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private String registrationNumber;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Section section;

	@Column(nullable = false)
	private String department;

	@Column(nullable = false, name = "sem", columnDefinition = "TINYINT")
	private byte sem;

}
