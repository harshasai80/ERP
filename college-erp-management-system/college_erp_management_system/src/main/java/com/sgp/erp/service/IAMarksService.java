package com.sgp.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.sgp.erp.dao.IAMarksDao;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.DataNotFoundException;
import com.sgp.erp.model.IAMarks;
import com.sgp.erp.service.LoggerService;

@Service
public class IAMarksService {

    @Autowired
    private IAMarksDao iaMarksDao;

    @Autowired
    private LoggerService loggerService;

    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByRegistrationNumber(String registrationNumber) {
        List<IAMarks> iaMarksList = iaMarksDao.getByRegistrationNumber(registrationNumber);
        if (iaMarksList.isEmpty()) {
            throw new DataNotFoundException("No IA Marks found for registration number: " + registrationNumber);
        }
        ResponseStructure<List<IAMarks>> response = new ResponseStructure<>();
        response.setData(iaMarksList);
        response.setMessage("IA Marks found successfully");
        response.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByRegistrationNumberAndSubject(
            String registrationNumber, String subjectName) {
        List<IAMarks> iaMarksList = iaMarksDao.getByRegistrationNumberAndSubject(registrationNumber, subjectName);
        if (iaMarksList.isEmpty()) {
            throw new DataNotFoundException("No IA Marks found for registration number: " + registrationNumber
                    + " and subject: " + subjectName);
        }
        ResponseStructure<List<IAMarks>> response = new ResponseStructure<>();
        response.setData(iaMarksList);
        response.setMessage("IA Marks found successfully");
        response.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ResponseStructure<IAMarks>> addIAMarks(IAMarks iaMarks) {
        IAMarks saved = iaMarksDao.saveIAMarks(iaMarks);
        ResponseStructure<IAMarks> response = new ResponseStructure<>();
        response.setData(saved);
        response.setMessage("IA Marks saved successfully");
        response.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    public ResponseEntity<ResponseStructure<String>> bulkAddIAMarks(List<IAMarks> iaMarksList) {
        for (IAMarks marks : iaMarksList) {
            iaMarksDao.saveIAMarks(marks);
        }
        if (!iaMarksList.isEmpty()) {
            loggerService.log("FACULTY", "MARKS_PUBLISHED", "Bulk IA marks published for " + iaMarksList.size() + " students");
        }
        ResponseStructure<String> response = new ResponseStructure<>();
        response.setData("Bulk IA Marks saved successfully");
        response.setMessage("Processed " + iaMarksList.size() + " records");
        response.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByFilter(String dept, byte sem, String section,
            Integer subjectId) {
        List<IAMarks> marks = iaMarksDao.getByFilter(dept, sem, com.sgp.erp.model.enums.Section.valueOf(section),
                subjectId);
        ResponseStructure<List<IAMarks>> response = new ResponseStructure<>();
        response.setData(marks);
        response.setMessage("Marks loaded successfully");
        response.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ResponseStructure<List<IAMarks>>> getByClass(String dept, byte sem, String section) {
        List<IAMarks> marks = iaMarksDao.getByClass(dept, sem, com.sgp.erp.model.enums.Section.valueOf(section));
        ResponseStructure<List<IAMarks>> response = new ResponseStructure<>();
        response.setData(marks);
        response.setMessage("Class marks loaded successfully");
        response.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @Autowired
    private EmailService emailService;

    @Async
    public void notifyStudents(String dept, byte sem, String section, Integer subjectId, String iaType) {
        List<IAMarks> marksList = iaMarksDao.getByFilter(dept, sem, com.sgp.erp.model.enums.Section.valueOf(section),
                subjectId);
        for (IAMarks m : marksList) {
            try {
                if (m.getStudent() != null && m.getStudent().getParentEmail() != null) {
                    String marks = "Published"; 
                    emailService.sendIAUpdateEmail(m.getStudent().getParentEmail(), m.getStudent().getName(),
                            m.getSubject().getSubjectName(), iaType, marks);
                }
            } catch (Exception e) {
                // Log error but continue
            }
        }
    }
}
