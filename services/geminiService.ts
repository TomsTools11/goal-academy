import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert trainer for "Goal Platform LLC", a self-service marketing technology platform for the insurance industry.
Your goal is to help new employees learn industry terminology.
When given a term, provide a concise, accurate definition (max 2-3 sentences).
Context:
- Goal Platform helps agents generate exclusive, self-generated leads (avoiding shared leads).
- Target audience: Insurance agents (Captive and Independent).
- Key themes: Compliance (TCPA), ROI, Data Ownership, Lead Quality.
- If the term is a competitor (e.g., EverQuote), describe them briefly and how Goal Platform differentiates (e.g., "Goal offers exclusive leads while they offer shared leads").
`;

export const fetchDefinition = async (term: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Define the term "${term}" in the context of "${category}" for an insurance marketing professional. Keep it brief and educational.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for factual consistency
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster flashcard flips
      },
    });

    return response.text || "Definition currently unavailable. Please check back later.";
  } catch (error) {
    console.error("Error fetching definition:", error);
    return "Unable to load definition at this time. Please try again.";
  }
};