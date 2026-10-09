xcopy c:\FCC\Projects\nasa\cert_management\verify.html w:\cert_management /s /e /h /y
xcopy c:\FCC\Projects\nasa\cert_management\css\ w:\cert_management\css /s /e /h /y
xcopy c:\FCC\Projects\nasa\cert_management\js\ w:\cert_management\js /s /e /h /y
xcopy c:\FCC\Projects\nasa\cert_management\images\ w:\cert_management\images /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc\js\classes\ModalWindow.js w:\fcc\js\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc\js\classes\Dropdown.js w:\fcc\js\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc\js\classes\Notification.js w:\fcc\js\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc\js\classes\AlertPopupWindow.js w:\fcc\js\ /s /e /h /y

@echo off
powershell -command "& {Write-Host 'BUILD DONE' -ForegroundColor Yellow}"