# MySQL Password Setup Guide

## Current Issue
Your Spring Boot application cannot connect to MySQL because of authentication issues.

## Solution: Set MySQL Password

### Method 1: Using MySQL Workbench (RECOMMENDED)

1. **Open MySQL Workbench 8.0**

2. **Connect to Local Instance**
   - Click on your "Local instance MySQL80" connection
   - If it asks for a password, try leaving it blank or try common passwords

3. **Open Users and Privileges**
   - Click on **Server** menu → **Users and Privileges**
   - OR click on **Administration** tab → **Users and Privileges**

4. **Select Root User**
   - In the user list, find and click on **root** with host **localhost**

5. **Set Password**
   - Look for the **"Login"** tab or **"Authentication"** section
   - Find the **Password** field
   - Enter: `root123`
   - Click **Apply** button at the bottom right

6. **Test Connection**
   - Close MySQL Workbench
   - Reopen it and try to connect
   - It should now ask for password: `root123`

### Method 2: Using MySQL Command Line (Alternative)

If you can access MySQL command line:

```sql
-- Connect to MySQL (if you can)
mysql -u root

-- Then run this command:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
FLUSH PRIVILEGES;
EXIT;
```

### Method 3: Reset MySQL Root Password (If nothing works)

If you've forgotten the password or can't access MySQL:

1. **Stop MySQL Service**
   ```powershell
   Stop-Service MySQL80
   ```

2. **Start MySQL in Safe Mode**
   ```powershell
   mysqld --skip-grant-tables
   ```

3. **In a new PowerShell window, connect without password**
   ```powershell
   mysql -u root
   ```

4. **Reset the password**
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
   EXIT;
   ```

5. **Restart MySQL normally**
   ```powershell
   Restart-Service MySQL80
   ```

## After Setting Password

Once you've set the password to `root123`, run:

```powershell
cd "C:\Users\RAHUL\Desktop\Full Stack Project\food-donation-backend"
.\mvnw.cmd spring-boot:run
```

## If You Want a Different Password

If you prefer a different password (e.g., `mypassword`):

1. Set that password in MySQL Workbench
2. Update `application.properties`:
   - Open: `food-donation-backend\src\main\resources\application.properties`
   - Change line 12 to: `spring.datasource.password=mypassword`
   - Save the file

## Verify MySQL Connection

Test if password works:

```powershell
mysql -u root -proot123 -e "SELECT 1;"
```

If this returns "1", your password is set correctly!

## Need Help?

If you're still having issues:
1. Check if MySQL service is running: `Get-Service MySQL80`
2. Check MySQL error logs
3. Try reinstalling MySQL Workbench
