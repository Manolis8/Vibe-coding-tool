# AI Website Builder ⚡

A command-line AI website builder that generates real websites from plain-English prompts.  
Interact with your AI-powered terminal, iterate on designs, and preview websites instantly in your browser.

## Features

- Generate fully functional HTML/CSS/JS websites from plain text prompts
- Live terminal chat interface
- Auto-opens generated websites in your browser
- Modify and iterate on designs in real-time
- Runs entirely locally — no cloud account required
- Easy to extend for React or more complex web apps

## Getting Started

### Prerequisites
- [Node.js LTS](https://nodejs.org/) installed
- Windows Terminal, PowerShell, or CMD
- An [OpenAI API key](https://platform.openai.com/account/api-keys)

### Installation

```bash
# Clone the repo
git clone https://github.com/Manolis8/ai-website-builder.git
cd ai-website-builder

# Install dependencies
npm install

# Create a .env file with your API key
echo OPENAI_API_KEY=your_key_here > .env

# Start the AI builder
node app.js

Type prompts like:

Create a landing page 
Make the background dark with white text
Add a hero section, features, and footer

Commands available in the chat:

/help — Show available commands

/files — List generated files

/reset — Start a new project

/open — Open current project folder in Explorer

/exit — Quit the app

Project Structure
ai-website-builder/
├── app.js
├── package.json
├── .env
├── .env.example
├── .gitignore
└── src/
    ├── chat.js
    ├── fileManager.js
    ├── prompts.js
    └── ui.js
