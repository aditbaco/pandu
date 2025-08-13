@echo off
echo Building PANDU for production...
call npm run build
echo Starting PANDU Production Server...
set NODE_ENV=production
node dist/index.js
pause