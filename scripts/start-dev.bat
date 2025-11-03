@echo off
echo Killing any process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F 2>nul
)

echo Starting development server...
cd %~dp0..
npm run dev
