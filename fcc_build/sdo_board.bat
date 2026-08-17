xcopy c:\FCC\Projects\nasa\sdo_board\index.html w:\sdo_board /s /e /h /y
xcopy c:\FCC\Projects\nasa\sdo_board\font\ w:\sdo_board\font /s /e /h /y
xcopy c:\FCC\Projects\nasa\sdo_board\js\ w:\sdo_board\js /s /e /h /y
xcopy c:\FCC\Projects\nasa\sdo_board\images\ w:\sdo_board\images /s /e /h /y
xcopy c:\FCC\Projects\nasa\sdo_board\css\ w:\sdo_board\css /s /e /h /y

@echo off
powershell -command "& {Write-Host 'BUILD DONE' -ForegroundColor Yellow}"