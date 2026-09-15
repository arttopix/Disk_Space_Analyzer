@echo off
title Disk Space Analyzer
cd /d "%~dp0"

echo ========================================================
echo   Launching Disk Space Analyzer (Backend + Frontend)
echo ========================================================

if exist "backend\venv\Scripts\python.exe" (
    backend\venv\Scripts\python.exe run.py
) else (
    python run.py
)

pause
