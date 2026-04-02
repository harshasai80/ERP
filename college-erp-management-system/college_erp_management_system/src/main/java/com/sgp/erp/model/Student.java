package com.sgp.erp.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgp.erp.model.enums.Section;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

	@Column(name = "sem", columnDefinition = "TINYINT")
	private byte sem;

	@Column(name = "parent_email")
	private String parentEmail;

	@Column(name = "parent_phone")
	private String parentPhone;

	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	public List<Attendance> attendances;

}
