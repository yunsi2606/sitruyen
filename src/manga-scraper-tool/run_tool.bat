@echo off
cd /d "%~dp0"
echo Checking dependencies...
if not exist node_modules call npm install
echo Starting Universal Manga Scraper...
echo Access the UI at: http://localhost:5173
npm start
pause
