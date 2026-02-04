$headers = @{
    "Content-Type"  = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaWtua3NyY2JxeXh2dGt1ZXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzIyODMsImV4cCI6MjA4NTU0ODI4M30.cYRqq7Dn-R4hMUtHSIGQMU12mKq3ArzArfZ29nKOyeE"
}

Write-Host "Testing get-availability..."
try {
    # 2026-02-06 is a Friday
    $response = Invoke-RestMethod -Uri "https://pqiknksrcbqyxvtkueqe.supabase.co/functions/v1/get-availability" -Method Post -Headers $headers -Body '{"date": "2026-02-06", "serviceSlug": "individual"}'
    Write-Host "Success! Slots found for Friday 2026-02-06:"
    $response.slots | ForEach-Object { Write-Host "- $_" }
}
catch {
    Write-Host "ERROR_DETAILS_START"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host "RESPONSE_BODY: $errBody"
    }
    Write-Host "ERROR_DETAILS_END"
}

Write-Host "`nTesting create-payment..."
try {
    $body = @{
        serviceSlug   = "individual"
        customerName  = "Test Agent"
        customerEmail = "test@example.com"
        bookingDate   = "2026-02-05"
        bookingTime   = "10:00"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "https://pqiknksrcbqyxvtkueqe.supabase.co/functions/v1/create-payment" -Method Post -Headers $headers -Body $body
    Write-Host "Success! Payment Preference Created:"
    Write-Host "Preference ID: $($response.preference_id)"
    Write-Host "Init Point: $($response.init_point)"
}
catch {
    Write-Host "Error in create-payment:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host "Details: $errBody"
    }
}
