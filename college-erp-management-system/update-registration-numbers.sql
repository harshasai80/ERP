-- SQL Script to update all registration numbers
-- This will transform registration numbers from format "459DME01" to "459DME25001"

-- First, let's see what we have
SELECT 
    id,
    registration_number AS old_registration_number,
    CONCAT(
        SUBSTRING(registration_number, 1, 3),  -- Get first 3 digits (459)
        SUBSTRING(registration_number, 4, 3),  -- Get department code (DME)
        '25',                                   -- Add '25'
        SUBSTRING(registration_number, 7)      -- Get remaining serial number (01)
    ) AS new_registration_number,
    name,
    department
FROM students
WHERE registration_number NOT LIKE '%25%'  -- Only update if '25' is not already present
ORDER BY registration_number;

-- Uncomment the following UPDATE statement to actually perform the update:
/*
UPDATE students
SET registration_number = CONCAT(
    SUBSTRING(registration_number, 1, 3),  -- Get first 3 digits (459)
    SUBSTRING(registration_number, 4, 3),  -- Get department code (DME)
    '25',                                   -- Add '25'
    SUBSTRING(registration_number, 7)      -- Get remaining serial number (01)
)
WHERE registration_number NOT LIKE '%25%'  -- Only update if '25' is not already present
  AND registration_number REGEXP '^[0-9]{3}[A-Z]{3}[0-9]+$';  -- Ensure it matches the expected pattern
*/
