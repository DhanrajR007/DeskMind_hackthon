const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(chatHistory){
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:chatHistory,
         config:{
      systemInstruction:`
     you are a ai customer support chatbot,
     you resolve customer queries in 10 to 50 words,
     use less tokens as you can,
     if the question is complex or you not able to solve querry you raise ticket,
     you can also suggest customer to raise ticket after 5 response.
      `
    }
    })
    return response.text;
}

module.exports = generateResponse