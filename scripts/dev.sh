#!/bin/bash

# Britescript VS Code Extension Development Script
echo "🚀 Britescript VS Code Extension Development"
echo "============================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Compile TypeScript
echo "🔨 Compiling TypeScript..."
bun run compile

# Check for VS Code
if ! command -v code &> /dev/null; then
    echo "⚠️  VS Code CLI not found. Please install VS Code and add to PATH."
    echo "   You can still develop the extension by opening VS Code manually."
else
    echo "🎯 Opening extension in VS Code..."
    code .
fi

echo ""
echo "✅ Development setup complete!"
echo ""
echo "Next steps:"
echo "1. Press F5 in VS Code to launch Extension Development Host"
echo "2. Open a .bs file to test syntax highlighting"
echo "3. Use Ctrl+Shift+P and search for 'Britescript' commands"
echo "4. Edit examples/example.bs to test features"
echo ""
echo "📖 Read README.md for full development guide"