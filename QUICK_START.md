# ⚡ QUICK START - Cyber X AI

## 🎯 What to Do First

### Option 1: EASIEST (Windows Only)
1. **Double-click**: `START_SERVER.bat`
2. The script will automatically:
   - Check Node.js installation
   - Install dependencies
   - Create .env file
   - Start the server
3. Open browser: **http://localhost:3000**

### Option 2: Manual (All Platforms)

#### Step 1️⃣ - Install Node.js (ONE TIME ONLY)
- Download: https://nodejs.org/en/download (LTS version)
- Install it
- Restart your terminal/PowerShell after installation

#### Step 2️⃣ - Navigate to Project
```bash
cd c:\Users\STUDENT\Downloads\cyber-x-ai-final
```

#### Step 3️⃣ - Install Dependencies (ONE TIME ONLY)
```bash
npm install
```

#### Step 4️⃣ - Setup Environment File
```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and add your API key:
```
ANTHROPIC_API_KEY=sk_ant_xxxxxxxxxxxxxxxxxxxx
PORT=3000
```

Get your API key from: https://console.anthropic.com

#### Step 5️⃣ - Start Server
```bash
npm start
```

You should see:
```
✅ Cyber X AI backend running → http://localhost:3000
```

#### Step 6️⃣ - Open in Browser
Visit: **http://localhost:3000**

---

## 🔧 Environment File Issues Fixed ✅

- ✅ Created `.env` file (actual file, not `.env.example`)
- ✅ Updated `.gitignore` to ignore `.env` 
- ✅ Created `START_SERVER.bat` for easy startup
- ✅ All dependencies listed in `package.json`
- ✅ Server configured to load from `.env`

---

## 📋 File Structure

```
cyber-x-ai-final/
├── index.html           (Frontend UI)
├── server.js            (Node.js backend)
├── package.json         (Dependencies)
├── .env                 (YOUR API KEY - Keep Secret!)
├── .env.example         (Template for .env)
├── START_SERVER.bat     (Easy startup script)
├── README.md            (Full documentation)
├── SETUP.md             (Detailed setup guide)
├── QUICK_START.md       (This file!)
└── node_modules/        (Downloaded after npm install)
```

---

## ❓ Troubleshooting

### "Node.js not found" / "node: command not found"
→ Install Node.js from https://nodejs.org/en/download
→ Restart PowerShell/Terminal after installation

### "Cannot find module" error
→ Run: `npm install`

### "ANTHROPIC_API_KEY not provided" / API errors
→ Check your `.env` file has the correct API key
→ Get key from: https://console.anthropic.com
→ Restart server after adding API key

### Port 3000 already in use
→ Edit `.env` and change: `PORT=3001` (or any free port)
→ Then access: http://localhost:3001

### Still not working?
→ Check SETUP.md for detailed troubleshooting

---

## ✨ Features

- 🤖 AI with Claude 3.5 Sonnet
- 🌍 Animated rotating globe
- 🎙️ Text-to-speech with male voice
- 📱 Responsive design
- 💬 Streaming responses
- 🔒 Rate limiting
- 🎨 Dark mode UI

---

## 🚀 Next Steps After Starting

1. Enter your name when prompted
2. Start asking coding questions!
3. Try the quick topics or ask anything
4. Use the 🔊 Listen button to hear AI responses
5. Click tags to ask pre-made questions

**Enjoy!** 🎉
