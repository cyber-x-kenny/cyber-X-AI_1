# Cyber X AI 🤖

A streaming chat interface powered by Claude 3.5 Sonnet with a rotating globe background animation.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Add Your Anthropic API Key
Edit `.env` and add your API key from [console.anthropic.com](https://console.anthropic.com):
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

### 4. Start the Server
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Development with Auto-Reload
```bash
npm run dev
```

## Features
- ✨ Real-time streaming responses from Claude 3.5 Sonnet
- 🌍 Animated rotating globe background
- 📝 Full markdown support with syntax highlighting
- 📋 Copy code blocks to clipboard
- 💬 Conversation history (last 10 messages)
- 🔒 Rate limiting (20 requests per minute)
- 🎨 Dark mode UI with glassmorphism effects

## API

### POST /chat-stream
Sends a message and streams the response.

**Body:**
```json
{
  "message": "Your question here",
  "history": []
}
```

**Response:** Server-Sent Events (text/plain stream)

### GET /health
Health check endpoint returns model and status info.

## Issues Fixed
✅ Model name updated to `claude-3-5-sonnet-20241022`
✅ Environment file standardized to `.env`
✅ Frontend model display corrected
✅ Gitignore updated for proper .env handling
