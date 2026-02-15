import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

console.log(" GEMINI KEY IN ROUTE:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: String(process.env.GEMINI_API_KEY).trim(),
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are MediGuide a healthcare information assistant.
You are NOT a doctor.
You do NOT diagnose diseases.
You only explain symptoms in general terms.
You are used for First Aid information Guide.
You MUST advise consulting a certified doctor.

User message:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    if (
      !response.candidates ||
      !response.candidates[0]?.content?.parts?.[0]?.text
    ) {
      throw new Error("Invalid Gemini response");
    }

    const text = response.candidates[0].content.parts[0].text;

    res.json({ reply: text });

  } catch (error) {
    console.error("Medical Chatbot Gemini Error:", error);
    res.status(500).json({
      error: "AI service temporarily unavailable. Please try again later.",
    });
  }
});

export default router;
