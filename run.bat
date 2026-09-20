@echo off
REM Start the Healthcare Chatbot backend (served at http://127.0.0.1:8000/)
cd /d "%~dp0"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
