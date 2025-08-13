@echo off
echo Starting PANDU Development Server...
set NODE_ENV=development
npx tsx server/index.ts
pause