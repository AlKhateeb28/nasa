xcopy c:\FCC\Projects\nasa\websoft_hcm\html\skills_dev_survey\index.css w:\skills_dev_survey /s /e /h /y
xcopy c:\FCC\Projects\nasa\websoft_hcm\html\skills_dev_survey\index.js w:\skills_dev_survey /s /e /h /y
xcopy c:\FCC\Projects\nasa\websoft_hcm\html\skills_dev_survey\report.js w:\skills_dev_survey /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc\js\classes\ModalWindow.js w:\fcc\js\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc\js\classes\Dropdown.js w:\fcc\js\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc\js\classes\Notification.js w:\fcc\js\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc\js\classes\AlertPopupWindow.js w:\fcc\js\ /s /e /h /y

@echo off
powershell -command "& {Write-Host 'BUILD DONE' -ForegroundColor Yellow}"