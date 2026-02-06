# Supabase Edge Function Deployment Script
# Function: create-booking
# Project: constelaciones-conscientes (pqiknksrcbqyxvtkueqe)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying create-booking Edge Function" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is available
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue

if ($supabaseCmd) {
    Write-Host "✓ Supabase CLI found" -ForegroundColor Green
    Write-Host "Deploying function..." -ForegroundColor Yellow
    
    supabase functions deploy create-booking --project-ref pqiknksrcbqyxvtkueqe
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Function deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Deployment failed" -ForegroundColor Red
        Write-Host "Please deploy manually via dashboard" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Supabase CLI not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please deploy manually:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://supabase.com/dashboard/project/pqiknksrcbqyxvtkueqe/functions" -ForegroundColor White
    Write-Host "2. Click 'Deploy new function'" -ForegroundColor White
    Write-Host "3. Name: create-booking" -ForegroundColor White
    Write-Host "4. Copy content from: supabase/functions/create-booking/index.ts" -ForegroundColor White
    Write-Host ""
    Write-Host "Opening function file..." -ForegroundColor Yellow
    code supabase/functions/create-booking/index.ts
}
