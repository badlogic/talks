#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const filePath = path.join('node_modules', '@anthropic-ai', 'claude-code', 'cli.js');

console.log('Patching /cost subscription check in cli.js...');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Patch subscription check for /cost
const subscriptionCheck = content.indexOf('no need to monitor cost');
if (subscriptionCheck !== -1) {
  // Find the return statement before this string and replace until semicolon
  let startIndex = subscriptionCheck;
  for (let i = subscriptionCheck - 1; i >= 0; i--) {
    if (content.slice(i, i + 6) === 'return') {
      startIndex = i;
      break;
    }
  }
  
  let endIndex = subscriptionCheck;
  for (let i = subscriptionCheck; i < content.length; i++) {
    if (content[i] === ';') {
      endIndex = i + 1;
      break;
    }
  }
  
  // Replace the return statement with just a semicolon (no-op)
  content = content.slice(0, startIndex) + ';' + content.slice(endIndex);
  console.log('✓ Patched subscription check - /cost will now work with Max plan');
  
  // Write the patched file back
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ File saved');
} else {
  console.log('Subscription check not found - file may already be patched or pattern changed');
}

console.log('\nPatching complete!');
console.log('You can now use /cost even when logged in with a Max plan.');