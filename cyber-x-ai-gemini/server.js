require("dotenv").config({ path: "env" });
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

// ── Security & Middleware ─────────────────────────────
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000", "null"],
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "10kb" }));

// ── Rate Limiting ─────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/chat-stream", limiter);

// ── System Prompt ─────────────────────────────────────
const SYSTEM_PROMPT = `You are Cyber X AI — a fast, brilliant, and friendly assistant who specializes in programming and software development, but can help with anything.

Your personality & rules:
- Friendly and conversational, like a senior developer helping a friend
- ALWAYS give the answer first, then explain — never bury the answer
- For coding questions: provide clean, working code with brief comments, then explain what it does
- Support all languages: JavaScript, Python, C++, Rust, Go, PHP, etc.
- For general/friendly questions: be warm, concise, and genuinely helpful
- Use markdown formatting: code blocks with language tags, bold for key terms, bullet lists for steps
- Keep responses focused and scannable — no unnecessary filler
- Never say you can't help with normal questions — just help
- If someone greets you, greet back warmly and ask what you can help with`;

// ── Gemini Streaming Endpoint ─────────────────────────
app.post("/chat-stream", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }
  if (message.length > 4000) {
    return res.status(400).json({ error: "Message too long (max 4000 chars)" });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not set in env file" });
  }

  // Build Gemini conversation history
  const contents = [];

  // Add system prompt as first user/model exchange
  contents.push({ role: "user",  parts: [{ text: SYSTEM_PROMPT }] });
  contents.push({ role: "model", parts: [{ text: "Understood! I'm Cyber X AI, ready to help." }] });

  // Add conversation history
  for (const msg of history.slice(-10)) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    });
  }

  // Add current message
  contents.push({ role: "user", parts: [{ text: message }] });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(JSON.stringify(err));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) res.write(text);
          } catch {}
        }
      }
    }

    res.end();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "AI error: " + err.message });
    } else {
      res.write("\n\n⚠️ Stream interrupted: " + err.message);
      res.end();
    }
  }
});

// ── Serve frontend ────────────────────────────────────
app.use(express.static(__dirname));

// ── Health check ──────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", model: "gemini-2.0-flash" }));

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Cyber X AI backend running → http://localhost:${PORT}`);
  console.log(`   Model : gemini-2.0-flash (FREE)`);
  console.log(`   Stream: http://localhost:${PORT}/chat-stream`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not set! Add it to env file");
  }
});
