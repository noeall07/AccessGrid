@echo off
echo ============================================
echo   AccessGrid - Full Setup Script
echo ============================================
echo.

REM --- Step 1: Create PostgreSQL database ---
echo [1/5] Creating PostgreSQL database "accessgrid"...
echo   (If it already exists, this step will be skipped)
psql -U postgres -c "CREATE DATABASE accessgrid;" 2>nul
if %errorlevel% neq 0 (
    echo   Database may already exist - continuing...
)
echo.

REM --- Step 2: Set up Python virtual environment ---
echo [2/5] Setting up Python backend...
cd backend
if not exist venv (
    echo   Creating virtual environment...
    python -m venv venv
)
echo   Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
echo.

REM --- Step 3: Initialize database tables and seed data ---
echo [3/5] Setting up database tables and demo data...
python seed.py
echo.

REM --- Step 4: Install frontend dependencies ---
echo [4/5] Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install
) else (
    echo   node_modules already exists - skipping...
)
echo.

REM --- Step 5: Done ---
echo [5/5] Setup complete!
echo.
echo ============================================
echo   HOW TO RUN:
echo   1. Open Terminal 1: cd backend ^& venv\Scripts\activate ^& python run.py
echo   2. Open Terminal 2: cd frontend ^& npm run dev
echo   3. Open browser: http://localhost:5173
echo.
echo   Demo Credentials:
echo     Admin:    admin / admin123
echo     Security: security / security123
echo     Student:  student / student123
echo ============================================
pause
