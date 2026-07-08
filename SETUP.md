# 🚀 Cyber X AI Setup Guide

## Step 1: Install Node.js

**IMPORTANT:** You must install Node.js first!

1. Visit: https://nodejs.org/en/download
2. Download **LTS version** (Long Term Support)
3. Run the installer and follow the steps
4. After installation, restart your terminal/PowerShell
5. Verify with: `node --version` and `npm --version`

## Step 2: Install Project Dependencies

```bash
cd c:\Users\STUDENT\Downloads\cyber-x-ai-final
npm install
```

## Step 3: Configure Environment

Edit the `.env` file:
- Get your API key from: https://console.anthropic.com
- Add to `.env`:
  ```
  ANTHROPIC_API_KEY=your_actual_api_key_here
  PORT=3000
  ```

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
✅ Cyber X AI backend running → http://localhost:3000
```

## Step 5: Open in Browser

Visit: http://localhost:3000

---

## Troubleshooting

### "node: command not found"
- Node.js is not installed or PATH not updated
- Solution: Reinstall Node.js and restart your terminal

### "Cannot find module"
- Dependencies not installed
- Solution: Run `npm install`

### "API key error"
- `.env` not configured properly
- Solution: Check your `.env` file has ANTHROPIC_API_KEY set

### Port 3000 already in use
- Another app is using that port
- Solution: Set different PORT in `.env` or kill the process using port 3000

---

**Questions?** Check the README.md file for more details!
