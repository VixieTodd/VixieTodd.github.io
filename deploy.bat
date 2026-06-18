@echo off
chcp 65001 >nul
echo ========== Hexo Deploy Script ==========
echo.

cd /d "%~dp0"

echo [1/3] Generate static files + deploy to GitHub
hexo g -d
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
git push origin source
if %errorlevel% neq 0 (
    echo ^>^> Push finished (nothing to commit or done)
) else (
    echo ^>^> Source pushed!
)

echo.
echo ========== All Done! ==========
echo.
pause
