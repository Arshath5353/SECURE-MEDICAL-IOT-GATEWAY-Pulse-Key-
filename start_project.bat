@echo off
echo ===========================================
echo   STARTING MEDICAL IOT SYSTEM (AUTO-PILOT)
echo ===========================================

:: 1. Start Backend in a new separate window
:: Using the venv python path from your screenshots
start "BACKEND SERVER" cmd /k "cd /d D:\Dr.dev\frontend\backend && D:\Dr.dev\venv\Scripts\python.exe app.py"

:: 2. Start Frontend in a new separate window
start "FRONTEND DASHBOARD" cmd /k "cd /d D:\Dr.dev\frontend && npm run dev"

echo.
echo Waiting for servers to warm up...
timeout /t 5

:: 3. Open Browser
start http://localhost:5173

echo.
echo DONE! DO NOT CLOSE THE BLACK WINDOWS THAT POPPED UP.
pause