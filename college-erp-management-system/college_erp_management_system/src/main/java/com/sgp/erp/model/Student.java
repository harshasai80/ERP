package com.sgp.erp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@ToString
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

	@Column(nullable = false)
	private String department;

	@Column(nullable = false, name = "sem", columnDefinition = "TINYINT")
	private byte sem;

}
