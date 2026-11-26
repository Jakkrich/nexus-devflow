@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-pstack.ps1" %*
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if "%EXIT_CODE%"=="0" (
  echo [DONE] sync-pstack finished successfully.
) else (
  echo [FAILED] sync-pstack exited with code %EXIT_CODE%.
)

set "SKIP_PAUSE=0"
set "ARGS=%*"
if defined ARGS (
  echo %ARGS% | find /i "-NoPause" >nul
  if "%ERRORLEVEL%"=="0" set "SKIP_PAUSE=1"
)

if "%SKIP_PAUSE%"=="0" (
  echo %cmdcmdline% | find /i "%~f0" >nul
  if "%ERRORLEVEL%"=="0" (
    echo.
    pause
  )
)

exit /b %EXIT_CODE%
