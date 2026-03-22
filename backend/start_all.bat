@echo off
cls
color 0A
echo ================================================
echo           TeamPulse - Full Stack
echo ================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend Server...
start "TeamPulse Backend" cmd /k "cd /d "%~dp0backend" && start_backend.bat"

echo Waiting for backend...
timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "TeamPulse Frontend" cmd /k "cd /d "%~dp0vitefrontend" && start_frontend.bat"

echo.
echo ================================================
echo TeamPulse is starting!
echo ================================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
pause