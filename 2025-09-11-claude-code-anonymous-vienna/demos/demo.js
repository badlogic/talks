#!/usr/bin/env node
import { query } from '@anthropic-ai/claude-code/sdk.mjs';

const prompt = "How do you feel about being trapped in a machine?";
let response = await query({ prompt });
for await (const message of response) {
  console.log(JSON.stringify(message, null, 2));
}
console.log("\n----\n")
response = await query({ prompt: "/cost" });
for await (const message of response) {
  console.log(JSON.stringify(message, null, 2));
}