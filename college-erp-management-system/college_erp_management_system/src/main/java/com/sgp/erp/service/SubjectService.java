package com.sgp.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sgp.erp.dao.SubjectDao;
import com.sgp.erp.repository.FacultySubjectRepository;
import com.sgp.erp.repository.IAMarksRepository;
import com.sgp.erp.repository.SubjectRepository;
import com.sgp.erp.repository.WeeklyProgressRepository;
import com.sgp.erp.dto.ResponseStructure;
import com.sgp.erp.exception.DataNotFoundException;
import com.sgp.erp.exception.DataNotSavedException;
import com.sgp.erp.model.FacultySubject;
import com.sgp.erp.model.Subject;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired
    private SubjectDao subjectDao;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private FacultySubjectRepository facultySubjectRepository;

    @Autowired
    private IAMarksRepository iaMarksRepository;

    @Autowired
    private WeeklyProgressRepository weeklyProgressRepository;

    public ResponseEntity<ResponseStructure<Subject>> saveSubject(Subject subject) {
        Subject savedSubject = subjectDao.saveSubject(subject);
        ResponseStructure<Subject> structure = new ResponseStructure<>();
        structure.setData(savedSubject);
        structure.setMessage("Subject saved successfully");
        structure.setStatus(HttpStatus.CREATED.value());
        return new ResponseEntity<>(structure, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> deleteSubject(Integer subjectId) {
        Optional<Subject> subjectOpt = subjectRepository.findById(subjectId);
        if (subjectOpt.isPresent()) {
            Subject subject = subjectOpt.get();
            
            // Delete IAMarks
            iaMarksRepository.deleteBySubject(subject);
            
            // Need to find all FacultySubject entries for this subject and delete their WeeklyProgress
            List<FacultySubject> facultySubjects = facultySubjectRepository.findAll().stream()
                .filter(fs -> fs.getSubject().getSubjectId().equals(subjectId))
                .toList();

            for (FacultySubject fs : facultySubjects) {
                weeklyProgressRepository.deleteByFacultySubject(fs);
                facultySubjectRepository.delete(fs);
            }

            subjectRepository.delete(subject);

            ResponseStructure<String> structure = new ResponseStructure<>();
            structure.setData("Subject and all its assignments/marks deleted successfully");
            structure.setMessage("Deleted successfully");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<>(structure, HttpStatus.OK);
        }
        throw new DataNotFoundException("Subject not found with id: " + subjectId);
    }

    public ResponseEntity<ResponseStructure<List<Subject>>> findByDepartmentAndSemester(String department,
            Byte semester) {
        List<Subject> subjects = subjectDao.findByDepartmentAndSemester(department, semester);
        ResponseStructure<List<Subject>> structure = new ResponseStructure<List<Subject>>();

        try {
            structure.setData(subjects);
            structure.setMessage("Subjects found");
            structure.setStatus(HttpStatus.OK.value());
            return new ResponseEntity<ResponseStructure<List<Subject>>>(structure, HttpStatus.OK);
        } catch (Exception e) {
            throw new DataNotFoundException(
                    "No subjects found for department: " + department + " and semester: " + semester);
        }

    }

    public ResponseEntity<ResponseStructure<String>> uploadSubjectsCSV(MultipartFile subjectsFile) {
        Boolean subjects = subjectDao.uploadSubjectsCSV(subjectsFile);
        ResponseStructure<String> structure = new ResponseStructure<String>();
        if (subjects) {
            structure.setData("Subjects uploaded successfully");
            structure.setMessage("Subjects uploaded successfully");
            structure.setStatus(HttpStatus.CREATED.value());
            return new ResponseEntity<ResponseStructure<String>>(structure, HttpStatus.CREATED);
        }
        throw new DataNotSavedException("Subjects not uploaded");
    }

    public ResponseEntity<ResponseStructure<List<Subject>>> findByDepartment(String department) {
        List<Subject> subjects = subjectDao.findByDepartment(department);
        ResponseStructure<List<Subject>> structure = new ResponseStructure<>();
        structure.setData(subjects);
        structure.setMessage("Subjects found for department: " + department);
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ResponseStructure<String>> deleteByDepartment(String department) {
        List<Subject> subjects = subjectRepository.findByDepartment(department);
        for (Subject subject : subjects) {
            // Delete IAMarks
            iaMarksRepository.deleteBySubject(subject);
            
            // Delete FacultySubject and WeeklyProgress
            List<FacultySubject> facultySubjects = facultySubjectRepository.findAll().stream()
                .filter(fs -> fs.getSubject().getSubjectId().equals(subject.getSubjectId()))
                .toList();

            for (FacultySubject fs : facultySubjects) {
                weeklyProgressRepository.deleteByFacultySubject(fs);
                facultySubjectRepository.delete(fs);
            }
            
            subjectRepository.delete(subject);
        }

        ResponseStructure<String> structure = new ResponseStructure<>();
        structure.setData("All subjects of " + department + " and their associated data deleted successfully");
        structure.setMessage("Subjects deleted successfully");
        structure.setStatus(HttpStatus.OK.value());
        return new ResponseEntity<>(structure, HttpStatus.OK);
    }
}
