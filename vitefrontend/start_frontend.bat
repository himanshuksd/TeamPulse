@echo off
cls
echo ================================
echo   TeamPulse Frontend Server
echo ================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting Vite dev server...
echo Frontend: http://localhost:5173
echo.

npm run dev

pause