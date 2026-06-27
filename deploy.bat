@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========== Hexo Deploy Script ==========
cd /d "%~dp0"

echo [1/3] Generate static files + deploy to GitHub
call hexo g -d
if %errorlevel% neq 0 (
    echo ^>^> Deploy failed! Check errors above.
    pause
    exit /b 1
)
echo ^>^> Deploy success!
echo.

echo [2/3] Stage source changes
git add -A
if %errorlevel% neq 0 (
    echo ^>^> Git add failed.
    pause
    exit /b 1
)

echo [3/3] Commit and push source code
for /f %%i in ('date /t') do set commit_date=%%i
git commit -m "Blog update - %commit_date%"
if %errorlevel% neq 0 (
    echo ^>^> No changes to commit or commit failed.
) else (
    echo ^>^> Commit success!
    git push origin source
    if %errorlevel% neq 0 (
        echo ^>^> Push failed!
        pause
        exit /b 1
    ) else (
        echo ^>^> Source pushed!
    )
)

echo ========== All Done! ==========
echo.
echo Press any key to exit...
pause