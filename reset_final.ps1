$initFile = "c:\Users\RAHUL\Desktop\Full Stack Project\mysql-init.txt"
$myIni = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"

Write-Host "Stopping MySQL..."
net stop MySQL80
Start-Sleep 5

Write-Host "Resetting password..."
# Note: mysqld will terminate itself after processing --init-file if started correctly for reset
# Actually, it might stay running, so we'll start it and wait a bit then kill it.
$p = Start-Process $mysqld -ArgumentList "--defaults-file=`"$myIni`"", "--init-file=`"$initFile`"", "--console" -PassThru -WindowStyle Hidden
Start-Sleep 15
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue

Write-Host "Starting MySQL..."
net start MySQL80
