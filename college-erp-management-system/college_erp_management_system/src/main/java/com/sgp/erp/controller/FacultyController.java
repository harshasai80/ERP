package com.sgp.erp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://103.44.2.245:3000"})
@RequestMapping("/faculty")
public class FacultyController {

}
