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

// ── Groq Streaming Endpoint ───────────────────────────
app.post("/chat-stream", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }
  if (message.length > 4000) {
    return res.status(400).json({ error: "Message too long (max 4000 chars)" });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not set in env file" });
  }

  // Build messages array
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-10),
    { role: "user", content: message }
  ];

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      })
    });

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
            const text = json?.choices?.[0]?.delta?.content;
            if (text) res.write(text);
          } catch {}
        }
      }
    }

    res.end();
  } catch (err) {
    console.error("Groq API error:", err.message);
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
app.get("/health", (_, res) => res.json({ status: "ok", model: "llama-3.3-70b-versatile" }));

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Cyber X AI backend running → http://localhost:${PORT}`);
  console.log(`   Model : llama-3.3-70b-versatile (Groq FREE)`);
  console.log(`   Stream: http://localhost:${PORT}/chat-stream`);
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY not set! Add it to env file");
  }
});
