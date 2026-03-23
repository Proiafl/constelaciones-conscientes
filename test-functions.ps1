$headers = @{
    "Content-Type"  = "application/json"
    "Authorization" = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3MjU2NDg4MCwiZXhwIjo0OTI4MjM4NDgwLCJyb2xlIjoiYW5vbiJ9.dySB3FYbW0tESNzscogz-BIODmiGDiohJqvyP9bvvgg"
}

Write-Host "Testing get-availability..."
try {
    $params = @{
        Uri     = "http://supabasekong-ioo4o0wsg8oggkwksg0o8o0k.31.97.250.155.sslip.io/functions/v1/get-availability"
        Method  = "Post"
        Headers = $headers
        Body    = '{"date": "2026-02-06", "serviceSlug": "individual"}'
    }
    $responseObject = Invoke-WebRequest @params -UseBasicParsing
    $response = $responseObject.Content | ConvertFrom-Json
    Write-Host "Status Code: $($responseObject.StatusCode)"
    Write-Host "Response Body: $($response | ConvertTo-Json -Depth 5)"
    Write-Host "Slots found for Friday 2026-02-06:"
    $response.slots | ForEach-Object { Write-Host "- $_" }
}
catch {
    Write-Host "ERROR_DETAILS_START"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errBody = $reader.ReadToEnd()
    Write-Host "RESPONSE_BODY: $errBody"
    Write-Host "ERROR_DETAILS_END"
}

Write-Host "`nTesting create-payment..."
$paymentResponse = $null
try {
    $body = @{
        serviceSlug   = "individual"
        customerName  = "Test Agent"
        customerEmail = "test@example.com"
        bookingDate   = "2026-02-05"
        bookingTime   = "10:00"
    } | ConvertTo-Json

    $paymentResponse = Invoke-RestMethod -Uri "http://supabasekong-ioo4o0wsg8oggkwksg0o8o0k.31.97.250.155.sslip.io/functions/v1/create-payment" -Method Post -Headers $headers -Body $body
    Write-Host "Response Body: $($paymentResponse | ConvertTo-Json -Depth 5)"
    Write-Host "Success! Payment Preference Created:"
    Write-Host "Preference ID: $($paymentResponse.preference_id)"
    Write-Host "Init Point: $($paymentResponse.init_point)"
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

Write-Host "`nTesting create-calendar-event..."
try {
    if ($paymentResponse -and $paymentResponse.payment_id) {
        $payment_id = $paymentResponse.payment_id
        Write-Host "Using payment_id: $payment_id"
        $params = @{
            Uri     = "http://supabasekong-ioo4o0wsg8oggkwksg0o8o0k.31.97.250.155.sslip.io/functions/v1/create-calendar-event"
            Method  = "Post"
            Headers = $headers
            Body    = ( @{ payment_id = $payment_id } | ConvertTo-Json )
        }
        $responseObject = Invoke-WebRequest @params -UseBasicParsing
        $calResponse = $responseObject.Content | ConvertFrom-Json
        Write-Host "Status Code: $($responseObject.StatusCode)"
        Write-Host "Response Body: $($calResponse | ConvertTo-Json -Depth 5)"
    } else {
        Write-Host "Skipping create-calendar-event because create-payment failed or didn't return payment_id."
    }
}
catch {
    Write-Host "Error in create-calendar-event:"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errBody = $reader.ReadToEnd()
        Write-Host "Details: $errBody"
    } else {
        Write-Host $_.Exception.Message
    }
}
