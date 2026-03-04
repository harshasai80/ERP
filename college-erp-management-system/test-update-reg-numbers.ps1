# Test script to update registration numbers
Write-Host "Testing registration number update endpoint..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/student/update-registration-numbers" -Method POST -ContentType "application/json"
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Yellow
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
