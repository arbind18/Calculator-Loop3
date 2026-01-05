import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

let API_KEY = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match) {
    API_KEY = match[1].trim();
  }
} catch (e) {
  console.error('Could not read .env.local');
}
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

console.log('Testing Gemini API...');
console.log('API Key present:', !!API_KEY);

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

async function testGemini() {
  try {
    // List models
    const listUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    const listResp = await fetch(`${listUrl}?key=${API_KEY}`);
    const listData = await listResp.json();
    console.log('Available Models:', listData.models?.map(m => m.name));

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, are you working?'
          }]
        }]
      })
    });

    if (!response.ok) {
      console.error('API Error Status:', response.status);
      console.error('API Error Text:', await response.text());
      return;
    }

    const data = await response.json();
    console.log('Success! Response:', data.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testGemini();
