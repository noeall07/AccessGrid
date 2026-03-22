@echo off
echo Starting AccessGrid Backend...
cd backend
call venv\Scripts\activate.bat
start "AccessGrid Backend" cmd /k "python run.py"

echo Starting AccessGrid Frontend...
cd ..\frontend
start "AccessGrid Frontend" cmd /k "npm run dev"

echo.
echo Both servers starting...
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo Open http://localhost:5173 in your browser.
timeout /t 3 >nul
