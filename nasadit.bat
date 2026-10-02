@echo off
rem Pripravi slozku k-nahrani = obsah web bez vyvojarskych souboru.
rem Pak cely obsah slozky k-nahrani nahrajte na Endoru do korene subdomeny Spolu 8 (osma.studentbase.cz).
rem Neni to build: jen kopirovani souboru.
cd /d "%~dp0"
findstr /c:"DOPLNIT" /c:"ruogwpyayxgclcwnaxky" web\js\config.js >nul
if %ERRORLEVEL% EQU 0 (
  echo CHYBA: web\js\config.js nema adresu a klic NOVEHO projektu Spolu 8. Viz SPUSTENI.md, krok B4.
  pause
  exit /b 1
)
robocopy web k-nahrani /MIR /XF komponenty.html nahled-obsahu.html DESIGN.md config.example.js /NFL /NDL /NJH /NJS /NP >nul
if %ERRORLEVEL% GEQ 8 (
  echo CHYBA pri kopirovani. Soubory nejsou pripravene.
  pause
  exit /b 1
)
echo Hotovo. Nahrajte na Endoru CELY obsah slozky:
echo   %~dp0k-nahrani
echo (vcetne podslozek css a js). Nahrajte vzdy vse, prepiste stare soubory.
pause
