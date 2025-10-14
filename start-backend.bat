@echo off
echo ========================================
echo Starting RTSP Overlay Backend (Flask)
echo ========================================
echo.
cd backend
call venv\Scripts\activate.bat
echo Backend starting on http://localhost:5000
echo Press CTRL+C to stop
echo.
python app.py
pause
