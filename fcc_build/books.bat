xcopy c:\FCC\Projects\nasa\books\mif.html w:\books\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\books\css\ w:\books\css\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\books\js\ w:\books\js\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\books\fonts\ w:\books\fonts\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\books\images\ w:\books\images\ /s /e /h /y
@echo off
powershell -command "& {Write-Host 'BUILD DONE' -ForegroundColor Yellow}"