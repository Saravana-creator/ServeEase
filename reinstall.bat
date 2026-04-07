@echo off
cd server
del package-lock.json
call npm install
cd ../client
del package-lock.json
call npm install
cd ..
git add .
