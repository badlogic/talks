# Hacking Claude Code - Anonymous Vienna Talk

## Slides
Open `slides.html` in your browser - no server required. Use arrow keys or spacebar to navigate.

## Demos

### Setup
```bash
cd demos
npm install
```

### Available Scripts

**setup.sh** - Formats Claude binary with Biome for debugging

**patch-antidebug.js** - Removes anti-debug checks from Claude Code
```bash
node patch-antidebug.js
```

**patch-cost.js** - Enables /cost command for Max plan users
```bash
node patch-cost.js
```

**intercept.sh** - Logs all Claude Code API requests
```bash
./intercept.sh [--messages]  # --messages for Anthropic calls only
```

**demo.js** - Test Claude Code SDK with debugging enabled
```bash
NODE_OPTIONS="--inspect-brk" node demo.js
```