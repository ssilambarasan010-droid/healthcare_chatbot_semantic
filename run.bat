@echo off
REM Start the Healthcare Chatbot backend (served at http://127.0.0.1:8000/)
REM main.py, index.html and logo.png live in the backend\ folder
cd /d "%~dp0backend"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
