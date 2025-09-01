const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function GenerateAI(chatHistory) {
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent({
    contents: chatHistory,
  });

  return result.response.text();
}

module.exports = { GenerateAI };
