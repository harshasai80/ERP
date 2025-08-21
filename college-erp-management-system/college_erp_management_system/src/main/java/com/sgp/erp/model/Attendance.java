package com.sgp.erp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "attendance", indexes = {
		@Index(name = "idx_student_date", columnList = "student_id, attendance_date")
})
public class Attendance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "student_id", nullable = false, foreignKey = @ForeignKey(name = "fk_attendance_student", foreignKeyDefinition = "FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE"))
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Student student;

	@Column(name = "attendance_date", nullable = false)
	private LocalDate attendanceDate;

	@Column(columnDefinition = "JSON", nullable = false)
	private String sessions;

	@Column(name = "batches")
	private String[] batches;

}
