$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$query = "UPDATE students SET registration_number = CONCAT(SUBSTRING(registration_number, 1, 3), SUBSTRING(registration_number, 4, 3), '25', SUBSTRING(registration_number, 7)) WHERE registration_number NOT LIKE '%25%' AND registration_number REGEXP '^[0-9]{3}[A-Z]{3}[0-9]+$';"

Write-Host "Updating registration numbers in database..." -ForegroundColor Cyan

& $mysqlPath -u root -pHarsha123 college_erp -e $query

if ($LASTEXITCODE -eq 0) {
    Write-Host "Registration numbers updated successfully!" -ForegroundColor Green
    
    Write-Host "Verifying updates..." -ForegroundColor Yellow
    $verifyQuery = "SELECT registration_number, name FROM students LIMIT 10;"
    & $mysqlPath -u root -pHarsha123 college_erp -e $verifyQuery
} else {
    Write-Host "Failed to update registration numbers" -ForegroundColor Red
}
