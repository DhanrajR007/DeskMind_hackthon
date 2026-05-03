const { GoogleGenAI } = require("@google/genai");
// Initialize Gemini
const ai = new GoogleGenAI({});

// Main function
const geminiAI = async (systemInstruction, prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Customer: ${prompt}`,
      generationConfig: {
        temperature: 0.5,
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);

    return "Sorry bhai, abhi thoda issue hai 😅 Aap shop visit kar lo, better help milegi. Aao kabhi!";
  }
};

module.exports = geminiAI;
