@echo off
REM One-time setup: install dependencies and build the chatbot's knowledge base
cd /d "%~dp0"
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Building embeddings from your dataset (data\ai-medical-chatbot.csv)...
python train_embeddings.py
echo.
echo Setup complete. Run "run.bat" to start the chatbot server.
pause
