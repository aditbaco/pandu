@echo off
echo Installing PANDU Dependencies...
echo.
echo Make sure you have Node.js installed (version 18 or higher)
echo.
npm install
echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Copy .env.example to .env and configure your database settings
echo 2. Run start-dev.bat to start development server
echo 3. Run start-prod.bat to build and start production server
echo.
pause