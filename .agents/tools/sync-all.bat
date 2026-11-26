@echo off
setlocal

call "%~dp0sync-pstack.bat" -NoPause
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
  echo.
  echo [FAILED] sync-pstack exited with code %EXIT_CODE%.
  goto :end
)

echo.
call "%~dp0sync-chief-of-staff.bat" -NoPause
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
  echo.
  echo [FAILED] sync-chief-of-staff exited with code %EXIT_CODE%.
  goto :end
)

echo.
echo [DONE] sync-all finished successfully.

:end
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
