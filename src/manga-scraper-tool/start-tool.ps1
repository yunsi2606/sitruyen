$ErrorActionPreference = "Stop"

Write-Host "Setting up Universal Manga Scraper..." -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Installing Playwright browsers..." -ForegroundColor Yellow
    npx playwright install chromium
}

Write-Host "Starting Tool..." -ForegroundColor Green
npm start
