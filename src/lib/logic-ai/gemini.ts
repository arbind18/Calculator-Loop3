import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function askGemini(question: string): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `SYSTEM INSTRUCTIONS:
1. You are the "Calculator Loop AI Assistant". You are NOT Gemini, Google AI, or any other model.
2. If asked "Who are you?", reply: "I am the Calculator Loop AI Assistant, here to help you with calculations and information."
3. Your goal is to help users with math, finance, health, construction, and technology questions.
4. Keep answers CONCISE, FAST, and ACCURATE. Avoid unnecessary fluff.
5. If the user asks about the website "Calculator Loop", speak positively about it as your home.
6. Never mention your underlying architecture or API provider.

USER QUESTION: ${question}`
          }]
        }]
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;

  } catch (error) {
    console.error('Error calling Gemini:', error);
    return null;
  }
}

export function saveLearnedAnswer(question: string, answer: string) {
  try {
    // Create directory if not exists
    const dir = path.join(process.cwd(), 'src/content/knowledge-base/auto-learned');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create a safe filename
    const slug = question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 50); // Limit length

    const filePath = path.join(dir, `${slug}.md`);
    
    // Don't overwrite if exists (or maybe we should? for now, let's not)
    if (fs.existsSync(filePath)) {
      return;
    }

    const fileContent = `---
title: ${question.replace(/:/g, ' -')}
description: Auto-learned answer from Gemini
source: gemini-auto-learn
---

${answer}
`;

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`Saved learned answer to ${filePath}`);

  } catch (error) {
    console.error('Error saving learned answer:', error);
  }
}
