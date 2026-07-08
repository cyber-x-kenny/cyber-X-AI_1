@echo off
REM Cyber X AI - Quick Start Script
REM This script will start the Cyber X AI server

color 0A
title Cyber X AI - Server

echo.
echo ============================================
echo   CYBER X AI - SERVER STARTUP
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/en/download
    echo.
    echo After installation, restart this script.
    pause
    exit /b 1
)

echo [✓] Node.js is installed
node --version
npm --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [*] Installing dependencies...
    call npm install
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    color 0E
    echo WARNING: .env file not found!
    echo.
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Edit .env and add your ANTHROPIC_API_KEY
    echo.
)

color 0B
echo ============================================
echo   STARTING CYBER X AI SERVER...
echo ============================================
echo.
echo URL: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

call npm start

pause
