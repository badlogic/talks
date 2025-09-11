#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filePath = path.join('node_modules', '@anthropic-ai', 'claude-code', 'cli.js');

console.log('Patching anti-debug in cli.js...');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Patch the anti-debug exit calls like cc-antidebug does
const patterns = [
  // Standard pattern: if(PF5())process.exit(1);
  /if\([A-Za-z0-9_$]+\(\)\)process\.exit\(1\);/g,
  // With spaces: if (PF5()) process.exit(1);
  /if\s*\([A-Za-z0-9_$]+\(\)\)\s*process\.exit\(1\);/g,
  // Different exit codes: if(PF5())process.exit(2);
  /if\([A-Za-z0-9_$]+\(\)\)process\.exit\(\d+\);/g,
];

let patched = false;
for (const pattern of patterns) {
  const newContent = content.replace(pattern, 'if(false)process.exit(1);');
  if (newContent !== content) {
    content = newContent;
    patched = true;
    console.log('Found and patched anti-debug exit call');
  }
}


if (!patched) {
  console.log('No patterns found to patch - file may already be patched');
}

// Write the patched file back
fs.writeFileSync(filePath, content, 'utf-8');

console.log('Patching complete!');
console.log('You can now debug with: NODE_OPTIONS="--inspect-brk" node demo.js');