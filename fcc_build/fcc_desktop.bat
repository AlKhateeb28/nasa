::xcopy c:\FCC\Projects\nasa\fcc-desktop\agent-vs-code.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\dashboard.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\fcc_courses.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\history.html p:\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc-desktop\index.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\joom_price_observer.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\mismatch.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\network.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\test.html p:\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\threads.html p:\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc-desktop\css\ p:\css\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\font\ p:\font\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\images\ p:\images\ /s /e /h /y
xcopy c:\FCC\Projects\nasa\fcc-desktop\js\index.js p:\js\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\json\ p:\json\ /s /e /h /y
::xcopy c:\FCC\Projects\nasa\fcc-desktop\reports\ p:\reports\ /s /e /h /y

@echo off
powershell -command "& {Write-Host 'BUILD DONE' -ForegroundColor Yellow}"