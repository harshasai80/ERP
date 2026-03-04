-- Migration Script from CIE to COLLEGE_ERP (Improved Mapping)

-- 1. Migrate Subjects (Courses)
INSERT IGNORE INTO college_erp.subject (department, max_marks, semester, subject_code, subject_name, value)
SELECT department, 100, semester, code, name, id FROM cie.courses;

-- 2. Migrate User Credentials
INSERT IGNORE INTO college_erp.users (email, password)
SELECT email, password FROM cie.users;

-- 3. Migrate Faculty
INSERT IGNORE INTO college_erp.faculty (name, email, department, role)
SELECT name, email, department, 
    CASE 
        WHEN role = 'principal' THEN 'PRINCIPAL'
        WHEN role = 'hod' THEN 'HOD'
        WHEN role = 'faculty' THEN 'FACULTY'
        ELSE 'FACULTY'
    END
FROM cie.users 
WHERE role IN ('principal', 'hod', 'faculty');

-- 4. Migrate Students
INSERT IGNORE INTO college_erp.students (name, registration_number, department, sem, section)
SELECT name, registration_number, department, semester, IFNULL(section, 'A') 
FROM cie.users 
WHERE role = 'student' AND registration_number IS NOT NULL;

-- 5. Migrate IA Marks (JSON Format)
INSERT IGNORE INTO college_erp.ia_marks (dept, ia_marks, student_id, subject_id)
SELECT 
    s.department,
    JSON_OBJECT(
        'IA - 1', m.ia1_marks,
        'IA - 2', m.ia2_marks,
        'IA - 3', m.ia3_marks,
        'IA - 4', m.ia4_marks,
        'IA - 5', m.ia5_marks
    ),
    s.id,
    sub.subject_id
FROM cie.ia_marks m
JOIN cie.users cu ON m.student_id = cu.id
JOIN cie.courses cc ON m.course_id = cc.id
JOIN college_erp.students s ON cu.registration_number COLLATE utf8mb4_0900_ai_ci = s.registration_number
JOIN college_erp.subject sub ON cc.code COLLATE utf8mb4_0900_ai_ci = sub.subject_code;

-- 6. Link Faculty to Subjects
-- subject_type = 0 (THEORY)
INSERT IGNORE INTO college_erp.faculty_subject (section, subject_type, faculty_id, subject_id)
SELECT 
    'A', 
    0, 
    f.id, 
    sub.subject_id
FROM cie.courses cc
JOIN cie.users cu ON cc.faculty_id = cu.id
JOIN college_erp.faculty f ON cu.email COLLATE utf8mb4_0900_ai_ci = f.email
JOIN college_erp.subject sub ON cc.code COLLATE utf8mb4_0900_ai_ci = sub.subject_code;
