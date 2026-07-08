# Cyber X AI - Setup & Launch Script
# This PowerShell script helps set up and launch the Cyber X AI server

# Colors for terminal
function Write-Status {
    param([string]$Message, [string]$Type = "INFO")
    $Colors = @{
        "INFO"    = "Cyan"
        "SUCCESS" = "Green"
        "WARNING" = "Yellow"
        "ERROR"   = "Red"
    }
    Write-Host $Message -ForegroundColor $Colors[$Type]
}

Write-Host ""
Write-Status "═══════════════════════════════════════════════" "SUCCESS"
Write-Status "   CYBER X AI - SETUP & LAUNCH SCRIPT" "SUCCESS"
Write-Status "═══════════════════════════════════════════════" "SUCCESS"
Write-Host ""

# Step 1: Check Node.js
Write-Status "[1/5] Checking Node.js installation..." "INFO"
$nodeCheck = try { node --version 2>&1 } catch { $null }

if ($null -eq $nodeCheck) {
    Write-Status "❌ Node.js not found!" "ERROR"
    Write-Host ""
    Write-Status "You need to install Node.js first!" "ERROR"
    Write-Host "Download from: https://nodejs.org/en/download"
    Write-Host "Choose the LTS version"
    Write-Host "After installation, restart PowerShell and run this script again"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
} else {
    Write-Status "✅ Node.js found: $nodeCheck" "SUCCESS"
}

# Step 2: Check npm
Write-Status "[2/5] Checking npm..." "INFO"
$npmCheck = try { npm --version 2>&1 } catch { $null }
if ($null -eq $npmCheck) {
    Write-Status "❌ npm not found!" "ERROR"
    Read-Host "Press Enter to exit"
    exit 1
} else {
    Write-Status "✅ npm found: $npmCheck" "SUCCESS"
}

Write-Host ""

# Step 3: Check and install dependencies
Write-Status "[3/5] Checking dependencies..." "INFO"
if (-Not (Test-Path "node_modules")) {
    Write-Status "Installing dependencies (this may take a minute)..." "WARNING"
    npm install 2>&1 | Out-Null
    Write-Status "✅ Dependencies installed" "SUCCESS"
} else {
    Write-Status "✅ Dependencies already installed" "SUCCESS"
}

Write-Host ""

# Step 4: Check .env file
Write-Status "[4/5] Checking .env configuration..." "INFO"
if (-Not (Test-Path ".env")) {
    Write-Status "Creating .env from .env.example..." "WARNING"
    Copy-Item ".env.example" ".env"
    Write-Status "✅ .env file created" "SUCCESS"
    Write-Status "⚠️  IMPORTANT: Edit .env and add your ANTHROPIC_API_KEY" "WARNING"
    Write-Status "Get your key from: https://console.anthropic.com" "WARNING"
    Write-Host ""
    $continue = Read-Host "Have you added your API key to .env? (yes/no)"
    if ($continue -ne "yes") {
        Write-Status "Please edit the .env file first, then run this script again" "WARNING"
        exit 1
    }
} else {
    Write-Status "✅ .env file exists" "SUCCESS"
    $apiKey = Select-String -Path ".env" -Pattern "ANTHROPIC_API_KEY" | Select-String -NotMatch "^#"
    if ($apiKey -match "your_api_key_here") {
        Write-Status "⚠️  WARNING: API key not configured!" "ERROR"
        Write-Status "Please edit .env and add your ANTHROPIC_API_KEY" "ERROR"
        Write-Status "Get your key from: https://console.anthropic.com" "ERROR"
        Read-Host "Press Enter after configuring your API key"
    }
}

Write-Host ""

# Step 5: Start server
Write-Status "[5/5] Starting Cyber X AI server..." "SUCCESS"
Write-Host ""
Write-Status "═══════════════════════════════════════════════" "SUCCESS"
Write-Status "✅ CYBER X AI IS STARTING!" "SUCCESS"
Write-Status "═══════════════════════════════════════════════" "SUCCESS"
Write-Host ""
Write-Status "📱 Open your browser to: http://localhost:3000" "INFO"
Write-Status "🛑 Press Ctrl+C to stop the server" "WARNING"
Write-Host ""

npm start
