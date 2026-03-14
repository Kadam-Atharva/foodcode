# Maven Installation Guide for Windows

## Quick Installation Steps

### Method 1: Download and Install Manually (Recommended)

1. **Download Maven:**
   - Visit: https://maven.apache.org/download.cgi
   - Download: `apache-maven-3.9.6-bin.zip` (Binary zip archive)

2. **Extract Maven:**
   - Extract the zip file to: `C:\Program Files\Apache\maven`
   - You should have: `C:\Program Files\Apache\maven\bin\mvn.cmd`

3. **Add Maven to System PATH:**
   - Right-click "This PC" → Properties → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\Apache\maven\bin`
   - Click OK on all dialogs

4. **Verify Installation:**
   - Open a NEW PowerShell/Command Prompt window
   - Run: `mvn --version`
   - You should see Maven version information

### Method 2: Using Chocolatey (If you have it)

```powershell
choco install maven
```

### Method 3: Using Scoop (If you have it)

```powershell
scoop install maven
```

## After Maven is Installed

Once Maven is installed, run these commands:

```bash
# Navigate to backend folder
cd "C:\Users\RAHUL\Desktop\Full Stack Project\food-donation-backend"

# Build and run the application
mvn clean install
mvn spring-boot:run
```

The backend will start on: http://localhost:8080

## Alternative: Use IDE (IntelliJ IDEA or Eclipse)

If you have IntelliJ IDEA or Eclipse installed:

1. Open the project folder: `food-donation-backend`
2. The IDE will automatically detect it's a Maven project
3. Right-click on `FoodDonationApplication.java`
4. Select "Run" or "Run as Spring Boot Application"

## Troubleshooting

**If Maven command not found after installation:**
- Close and reopen PowerShell/Command Prompt
- Verify PATH is set correctly
- Run: `echo $env:PATH` to check if Maven bin folder is listed

**If Java is not installed:**
- Download Java 17 or higher from: https://adoptium.net/
- Install and add to PATH similar to Maven
