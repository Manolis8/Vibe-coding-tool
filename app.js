#!/usr/bin/env node
// app.js — Entry point. Run with: node app.js
 
const readline = require("readline");
const { ChatSession }        = require("./src/chat");
const { printBanner, printHelp, colors } = require("./src/ui");
 
async function main() {
  printBanner();
 
  const session = new ChatSession();
 
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
    prompt: `\n${colors.cyan}You${colors.reset} › `,
  });
 
  console.log(
    `${colors.dim}Commands: /help /files /reset /open /exit${colors.reset}\n`
  );
  console.log(
    `${colors.yellow}AI${colors.reset} › What would you like to build today?\n`
  );
 
  rl.prompt();
 
  rl.on("line", async (input) => {
    const msg = input.trim();
    if (!msg) { rl.prompt(); return; }
 
    // Slash commands
    if (msg.startsWith("/")) {
      handleCommand(msg, session, rl);
      rl.prompt();
      return;
    }
 
    // Regular message → send to AI
    try {
      process.stdout.write(`\n${colors.yellow}AI${colors.reset} › `);
      await session.chat(msg);
      console.log();
    } catch (err) {
      console.error(
        `\n${colors.red}Error:${colors.reset} ${err.message}`
      );
      // Helpful hints for common errors
      if (err.status === 401) {
        console.log("  → Your API key is invalid. Check .env");
      } else if (err.status === 429) {
        console.log("  → Rate limit hit. Wait a few seconds.");
      } else if (err.message.includes("fetch")) {
        console.log("  → No internet connection.");
      }
    }
 
    rl.prompt();
  });
 
  rl.on("close", () => {
    console.log(
      `\n${colors.dim}Goodbye! Check your projects/ folder.${colors.reset}`
    );
    process.exit(0);
  });
}
 
function handleCommand(cmd, session, rl) {
  const command = cmd.split(" ")[0];
  switch (command) {
    case "/help":
      printHelp();
      break;
    case "/files":
      const files = session.fileManager?.listFiles() || [];
      if (files.length === 0) {
        console.log(`\n${colors.dim}No files yet.${colors.reset}\n`);
      } else {
        console.log(`\n${colors.cyan}Generated files:${colors.reset}`);
        files.forEach(f =>
          console.log(`  ${colors.green}•${colors.reset} ${f}`)
        );
        console.log();
      }
      break;
    case "/reset":
      session.reset();
      console.log(`\n${colors.green}✓${colors.reset} New session started.\n`);
      break;
    case "/open":
      session.openProject();
      break;
    case "/exit":
    case "/quit":
      rl.close();
      break;
    default:
      console.log(
        `\n${colors.red}Unknown:${colors.reset} ${command}. Try /help\n`
      );
  }
}
 
main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
