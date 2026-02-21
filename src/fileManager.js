// src/fileManager.js
// Parses AI responses and writes files to disk.
 
const fs   = require("fs");
const path = require("path");
const { colors } = require("./ui");
 
// Matches: <<<FILE: name>>>\ncontent\n<<<END_FILE>>>
const FILE_PATTERN =
  /<<<FILE:\s*([^\n>]+)>>>\n([\s\S]*?)<<<END_FILE>>>/g;
 
class FileManager {
  constructor() {
    // Each session gets a unique timestamped folder
    const ts = new Date().toISOString()
      .replace(/[:.TZ-]/g, "").slice(0, 14);
    this.projectDir = path.join(
      process.cwd(), "projects", `project-${ts}`
    );
    this.files   = {};   // filename → content cache
    this.created = false; // has the folder been made?
  }
 
  // Create the project folder on first use
  ensureDir() {
    if (!this.created) {
      fs.mkdirSync(this.projectDir, { recursive: true });
      this.created = true;
    }
  }
 
  // Parse AI response and write any files found
  async parseAndWrite(responseText) {
    const written = [];
    let match;
    FILE_PATTERN.lastIndex = 0; // reset regex
 
    while ((match = FILE_PATTERN.exec(responseText)) !== null) {
      const [, filePath, content] = match;
 
      // Security: prevent path traversal attacks
      const safePath = filePath.trim()
        .replace(/\.\.\/|\.\.\\/g, "")
        .replace(/^\//, "");
 
      this.ensureDir();
 
      const fullPath = path.join(this.projectDir, safePath);
      // Create subdirectories if needed (e.g. src/components/)
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
 
      // Write the file
      fs.writeFileSync(fullPath, content.trimEnd() + "\n", "utf8");
      this.files[safePath] = content;
      written.push(safePath);
    }
 
    return written;
  }
 
  // Auto-open browser for HTML files
  openBrowser(filename = "index.html") {
    const filePath = path.join(this.projectDir, filename);
    if (!fs.existsSync(filePath)) return;
    const { exec } = require("child_process");
    // On Windows, "start" opens the default program for the file type
    exec(`start "" "${filePath}"`);
  }
 
  // Returns current project state for AI context injection
  getContext() {
    const fileList = Object.keys(this.files);
    if (fileList.length === 0) return null;
    return {
      projectDir: this.projectDir,
      files: fileList,
      fileContents: Object.entries(this.files)
        .map(([name, content]) => {
          // Truncate very long files to save tokens
          const trimmed = content.length > 4000
            ? content.slice(0, 4000) + "\n...(truncated)"
            : content;
          return `### ${name}\n\`\`\`\n${trimmed}\n\`\`\``;
        })
        .join("\n\n"),
    };
  }
 
  listFiles() { return Object.keys(this.files); }
}
 
module.exports = { FileManager };
