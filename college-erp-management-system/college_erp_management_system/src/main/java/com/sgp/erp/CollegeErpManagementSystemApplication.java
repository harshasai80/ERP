package com.sgp.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CollegeErpManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeErpManagementSystemApplication.class, args);
	}

}
