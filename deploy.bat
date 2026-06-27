@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ANSI escape
for /f %%e in ('echo prompt $e ^| cmd') do set "ESC=%%e"

:: color shortcuts
set "C_RESET=%ESC%[0m"
set "C_RED=%ESC%[91m"
set "C_GREEN=%ESC%[92m"
set "C_YELLOW=%ESC%[93m"
set "C_CYAN=%ESC%[96m"

echo %C_CYAN%========== Hexo Deploy Script ==========%C_RESET%
cd /d "%~dp0"

echo %C_YELLOW%[1/3]%C_RESET% Generate static files + deploy to GitHub
call hexo g -d
if %errorlevel% neq 0 (
    echo %C_RED%^>^> Deploy failed! Check errors above.%C_RESET%
    pause
    exit /b 1
)
echo %C_GREEN%^>^> Deploy success!%C_RESET%
echo.

echo %C_YELLOW%[2/3]%C_RESET% Stage source changes
git add -A
if %errorlevel% neq 0 (
    echo %C_RED%^>^> Git add failed.%C_RESET%
    pause
    exit /b 1
)

echo %C_YELLOW%[3/3]%C_RESET% Commit and push source code
for /f %%i in ('date /t') do set commit_date=%%i
git commit -m "Blog update - %commit_date%"
if %errorlevel% neq 0 (
    echo %C_YELLOW%^>^> No changes to commit or commit failed.%C_RESET%
) else (
    echo %C_GREEN%^>^> Commit success!%C_RESET%
    git push origin source
    if %errorlevel% neq 0 (
        echo %C_RED%^>^> Push failed!%C_RESET%
        pause
        exit /b 1
    ) else (
        echo %C_GREEN%^>^> Source pushed!%C_RESET%
    )
)

echo %C_CYAN%========== All Done! ==========%C_RESET%
echo.
echo Press any key to exit...
pause