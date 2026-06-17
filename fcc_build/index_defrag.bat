xcopy c:\FCC\Projects\sdo\src\src\main\webapp\index_defrag\index.html w:\index_defrag\ /s /e /h /y
xcopy c:\FCC\Projects\sdo\src\src\main\webapp\index_defrag\css\ w:\index_defrag\css\ /s /e /h /y
xcopy c:\FCC\Projects\sdo\src\src\main\webapp\index_defrag\js\ w:\index_defrag\js\ /s /e /h /y
xcopy c:\FCC\Projects\sdo\src\src\main\webapp\index_defrag\fonts\ w:\index_defrag\fonts\ /s /e /h /y
xcopy c:\FCC\Projects\sdo\src\src\main\webapp\index_defrag\images\ w:\index_defrag\images\ /s /e /h /y
xcopy c:\FCC\Projects\sdo\src\src\main\webapp\fcc\js\classes\WebsocketInfo.js w:\fcc\js\ /s /e /h /y
xcopy c:\FCC\Projects\sdo\src\src\main\webapp\fcc\js\classes\Notification.js w:\fcc\js\ /s /e /h /y
@echo off
powershell -command "& {Write-Host 'BUILD DONE' -ForegroundColor Yellow}"