@echo off
REM Script to help update CORS configuration after Vercel deployment
REM Run this after you get your Vercel URL

echo.
echo ========================================
echo   CORS Configuration Helper
echo ========================================
echo.
echo This script will help you update the CORS configuration
echo after you deploy your frontend to Vercel.
echo.

REM Check if backend/.env exists
if not exist "backend\.env" (
    echo ERROR: backend\.env file not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Current CORS Configuration:
echo.
findstr "CORS_ORIGINS" backend\.env
echo.
echo.

echo Instructions:
echo 1. Deploy your frontend to Vercel
echo 2. Copy your Vercel deployment URL (e.g., https://rtspoverplay-abc123.vercel.app)
echo 3. Enter it below (without trailing slash)
echo.

set /p VERCEL_URL="Enter your Vercel URL: "

if "%VERCEL_URL%"=="" (
    echo ERROR: No URL provided!
    pause
    exit /b 1
)

REM Remove trailing slash if present
if "%VERCEL_URL:~-1%"=="/" set "VERCEL_URL=%VERCEL_URL:~0,-1%"

echo.
echo Updating backend\.env...

REM Create new CORS_ORIGINS line
set "NEW_CORS=CORS_ORIGINS=http://localhost:3000,%VERCEL_URL%"

REM Backup original file
copy backend\.env backend\.env.backup >nul

REM Update the file
powershell -Command "(Get-Content backend\.env) -replace 'CORS_ORIGINS=.*', '%NEW_CORS%' | Set-Content backend\.env"

echo.
echo ========================================
echo   Configuration Updated!
echo ========================================
echo.
echo New CORS Configuration:
findstr "CORS_ORIGINS" backend\.env
echo.
echo Backup saved to: backend\.env.backup
echo.
echo IMPORTANT: You also need to update this on Render!
echo.
echo Steps to update Render:
echo 1. Go to: https://dashboard.render.com
echo 2. Select your 'rtspoverplay' service
echo 3. Click 'Environment' in the left sidebar
echo 4. Update CORS_ORIGINS to:
echo    %NEW_CORS%
echo 5. Click 'Save Changes'
echo.
echo Your local backend will now accept requests from:
echo   - http://localhost:3000 (local frontend)
echo   - %VERCEL_URL% (production frontend)
echo.
pause

