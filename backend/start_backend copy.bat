@echo off
cls
echo ================================
echo   TeamPulse Backend Server
echo ================================
echo.

cd /d "%~dp0"

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo ❌ Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo.
echo ✅ Virtual environment activated
echo 🚀 Starting FastAPI server...
echo.
echo Backend will be available at:
echo 📍 http://127.0.0.1:8000
echo 📍 http://127.0.0.1:8000/docs (API Documentation)
echo.
echo Press Ctrl+C to stop the server
echo ================================
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause