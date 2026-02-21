// src/chat.js
// Manages conversation history and calls the OpenAI API.
 
const OpenAI = require("openai");
const { FileManager }    = require("./fileManager");
const { buildSystemPrompt } = require("./prompts");
const { colors }         = require("./ui");
 
// Load .env without any external library
function loadEnv() {
  const fs   = require("fs");
  const path = require("path");
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim()
      .replace(/^["']|["']$/g, ""); // strip quotes
    if (!process.env[key]) process.env[key] = val;
  }
}
 
class ChatSession {
  constructor() {
    loadEnv();
 
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      console.error(
        `\n${colors.red}✗ API key missing.${colors.reset}\n` +
        `  1. Open .env in VS Code\n` +
        `  2. Replace "your_api_key_here" with your key from platform.openai.com\n`
      );
      process.exit(1);
    }
 
    this.client      = new OpenAI({ apiKey });
    this.history     = [];  // full conversation [{role, content}]
    this.fileManager = new FileManager();
    // Change to "gpt-4o-mini" for faster/cheaper responses
    this.model       = "gpt-5-nano";
  }
 
  async chat(userMessage) {
    // Add user message to history
    this.history.push({ role: "user", content: userMessage });
 
    // Build system prompt with current file context
    const systemPrompt = buildSystemPrompt(
      this.fileManager.getContext()
    );
 
    let fullResponse = "";
 
    // Stream the response — text appears as it is generated
    // OpenAI streaming uses chat.completions.create with stream: true
    const stream = await this.client.chat.completions.create({
      model:    this.model,
      max_tokens: 8192,
      stream:   true,
      // OpenAI uses a single messages array; system prompt is first
      messages: [
        { role: "system", content: systemPrompt },
        ...this.history,
      ],
    });
 
    // OpenAI streams chunks with choices[0].delta.content
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        process.stdout.write(text);
        fullResponse += text;
      }
    }
 
    // Save AI response to history
    this.history.push({ role: "assistant", content: fullResponse });
 
    // Parse and write any files in the response
    const filesWritten = await this.fileManager.parseAndWrite(fullResponse);
 
    if (filesWritten.length > 0) {
      console.log(
        `\n\n${colors.green}✓ Files saved:${colors.reset} ` +
        filesWritten.join(", ")
      );
      console.log(
        `${colors.dim}  Folder: ${this.fileManager.projectDir}${colors.reset}`
      );
      // Automatically open index.html in browser
      this.fileManager.openBrowser("index.html");
    }
  }
 
  listFiles()  { this.fileManager.listFiles(); }
  getDir()     { return this.fileManager.projectDir; }
 
  reset() {
    this.history     = [];
    this.fileManager = new FileManager();
  }
 
  openProject() {
    const { exec } = require("child_process");
    exec(`start "" "${this.fileManager.projectDir}"`);
  }
}
 
module.exports = { ChatSession };
