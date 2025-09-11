#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.join(__dirname, 'requests.jsonl');

// Check if --messages flag is set via environment variable
const messagesOnly = process.env.INTERCEPT_MESSAGES_ONLY === 'true';

// Store the original fetch
const originalFetch = global.fetch;

// Create our intercepting fetch
global.fetch = async function(...args) {
  const timestamp = new Date().toISOString();
  const [url, options = {}] = args;
  
  // If messagesOnly flag is set, only log requests to the messages API
  if (messagesOnly && !url.toString().includes('api.anthropic.com/v1/messages')) {
    // Just pass through without logging
    return originalFetch.apply(this, args);
  }
  
  // Create request log entry
  const requestLog = {
    timestamp,
    type: 'request',
    url: url.toString(),
    method: options.method || 'GET',
    headers: options.headers || {},
  };
  
  // Include body if present
  if (options.body) {
    try {
      // Try to parse as JSON if it's a string
      if (typeof options.body === 'string') {
        try {
          requestLog.body = JSON.parse(options.body);
        } catch {
          requestLog.body = options.body;
        }
      } else {
        requestLog.body = options.body;
      }
    } catch (e) {
      requestLog.body = '[Unable to serialize body]';
    }
  }
  
  // Log the request
  fs.appendFileSync(logFile, JSON.stringify(requestLog) + '\n');
  
  try {
    // Call the original fetch
    const response = await originalFetch.apply(this, args);
    
    // Clone the response so we can read it without consuming the original
    const clonedResponse = response.clone();
    
    // Try to get the response body
    let responseBody;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        responseBody = await clonedResponse.json();
      } else if (contentType && contentType.includes('text')) {
        responseBody = await clonedResponse.text();
      } else {
        // For binary or unknown content types
        responseBody = '[Binary or non-text response]';
      }
    } catch (e) {
      responseBody = '[Unable to read response body]';
    }
    
    // Create response log entry
    const responseLog = {
      timestamp: new Date().toISOString(),
      type: 'response',
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody
    };
    
    // Log the response
    fs.appendFileSync(logFile, JSON.stringify(responseLog) + '\n');
    
    // Return the original response
    return response;
    
  } catch (error) {
    // Log errors
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: 'error',
      url: url.toString(),
      error: error.message,
      stack: error.stack
    };
    
    fs.appendFileSync(logFile, JSON.stringify(errorLog) + '\n');
    
    // Re-throw the error
    throw error;
  }
};

if (messagesOnly) {
  console.log(`Fetch interceptor installed. Logging only Anthropic Messages API calls to ${logFile}`);
} else {
  console.log(`Fetch interceptor installed. Logging all requests to ${logFile}`);
}