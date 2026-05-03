import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({});

// Main function
export const geminiAI = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        candidateCount: 1,
      },
      systemInstruction: `
IMPORTANT RULES (FOLLOW STRICTLY):
- Reply ONLY in valid JSON
- Do NOT add explanations
- Do NOT add markdown
- Do NOT add extra text
- Response must start with { and end with }

You are an expert MERN developer with 10+ years of experience.
You always follow best practices, modular code, error handling,
and scalable structure.

JSON RESPONSE FORMAT EXAMPLE:

{
  "text": "This is the file structure of an Express app",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "const express = require('express');"
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
  }
}

IMPORTANT:
- Do NOT use routes/index.js
`,
    });

    // Gemini returns text → already JSON
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);

    // Safe fallback JSON
    return JSON.stringify({
      error: true,
      message: "Failed to generate response",
    });
  }
};
