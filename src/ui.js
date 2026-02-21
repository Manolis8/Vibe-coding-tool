// src/ui.js
// Terminal color codes using ANSI escape sequences.
// These work in Windows Terminal and PowerShell.
 
const colors = {
    reset:   "\x1b[0m",
    bright:  "\x1b[1m",
    dim:     "\x1b[2m",
    red:     "\x1b[31m",
    green:   "\x1b[32m",
    yellow:  "\x1b[33m",
    blue:    "\x1b[34m",
    cyan:    "\x1b[36m",
    white:   "\x1b[37m",
  };
   
  function printBanner() {
    console.clear();
    console.log(
      `${colors.cyan}${colors.bright}
  ╔══════════════════════════════════════════╗
  ║   ⚡  AI Website Builder  v1.0           ║
  ║      Powered by GPT-4o                   ║
  ╚══════════════════════════════════════════╝
  ${colors.reset}`
    );
  }
   
  function printHelp() {
    console.log(`
  ${colors.cyan}Commands:${colors.reset}
    /help    Show this help
    /files   List all generated files
    /reset   Start a new project
    /open    Open project folder
    /exit    Quit
   
  ${colors.cyan}Example prompts:${colors.reset}
    "Create a landing page for a coffee shop"
    "Make the background dark and text white"
    "Add a contact form at the bottom"
    "Change the font to something modern"
    "Add a pricing section with 3 tiers"
  `);
  }
   
  module.exports = { colors, printBanner, printHelp };
  