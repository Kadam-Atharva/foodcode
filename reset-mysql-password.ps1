# MySQL Root Password Reset - my.ini approach
# This modifies my.ini to add skip-grant-tables, restarts MySQL, resets password, removes the option, restarts again.

Write-Host "=== MySQL Root Password Reset (my.ini approach) ===" -ForegroundColor Cyan

$myIniPath = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# Step 1: Read current my.ini
$content = Get-Content $myIniPath -Raw
Write-Host "Read my.ini successfully" -ForegroundColor Green

# Step 2: Add skip-grant-tables under [mysqld]
if ($content -notmatch 'skip-grant-tables') {
    $content = $content -replace '(\[mysqld\])', "`$1`r`nskip-grant-tables"
    Set-Content -Path $myIniPath -Value $content -NoNewline
    Write-Host "Added skip-grant-tables to my.ini" -ForegroundColor Green
}

# Step 3: Restart MySQL service
Write-Host "Restarting MySQL80 service..." -ForegroundColor Yellow
net stop MySQL80
Start-Sleep 5
net start MySQL80
Start-Sleep 5

# Step 4: Reset the root password
Write-Host "Resetting root password..." -ForegroundColor Yellow
& $mysqlPath -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; FLUSH PRIVILEGES;"
$resetResult = $LASTEXITCODE
Write-Host "Password reset exit code: $resetResult" -ForegroundColor Yellow

# Step 5: Remove skip-grant-tables from my.ini
$content = Get-Content $myIniPath -Raw
$content = $content -replace "`r`nskip-grant-tables", ""
$content = $content -replace "`nskip-grant-tables", ""
Set-Content -Path $myIniPath -Value $content -NoNewline
Write-Host "Removed skip-grant-tables from my.ini" -ForegroundColor Green

# Step 6: Restart MySQL again normally
Write-Host "Restarting MySQL80 normally..." -ForegroundColor Yellow
net stop MySQL80
Start-Sleep 5
net start MySQL80
Start-Sleep 3

# Step 7: Test the new password
Write-Host "Testing connection with new password 'root'..." -ForegroundColor Green
& $mysqlPath -u root -proot -e "SELECT 'PASSWORD RESET SUCCESSFUL!' AS Result;"
Write-Host "Test exit code: $LASTEXITCODE" -ForegroundColor Yellow

Write-Host "=== Done ===" -ForegroundColor Cyan
Read-Host "Press Enter to close"
