#!/bin/bash

# Clean slate - remove node_modules and reinstall
echo "Cleaning node_modules..."
rm -rf node_modules

echo "Running npm install..."
npm install

# Find the Claude Code binary
CLAUDE_BINARY="node_modules/@anthropic-ai/claude-code/cli.js"
BACKUP_BINARY="node_modules/@anthropic-ai/claude-code/cli.bak.js"

if [ ! -f "$CLAUDE_BINARY" ]; then
    echo "Error: Claude Code binary not found at $CLAUDE_BINARY"
    echo "Make sure you ran 'npm install' first"
    exit 1
fi

# Create backup
echo "Backing up original to $BACKUP_BINARY..."
cp "$CLAUDE_BINARY" "$BACKUP_BINARY"

# Format with Biome (in place)
echo "Formatting cli.js with Biome.js..."
npx @biomejs/biome format "$CLAUDE_BINARY" --write

# Open in VS Code
echo "Opening cli.js in VS Code..."
code "$CLAUDE_BINARY"