
import { GoogleGenAI, Type } from "@google/genai";
import { AIResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveMathProblem = async (problem: string): Promise<AIResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Solve the following math or logic problem and provide the result in a structured format. 
      Problem: ${problem}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: "The final answer to the problem.",
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of steps taken to solve the problem.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief summary or explanation of the mathematical principles used.",
            },
          },
          required: ["answer", "steps", "explanation"],
        },
      },
    });

    return JSON.parse(response.text || '{}') as AIResult;
  } catch (error) {
    console.error("AI Solve Error:", error);
    throw new Error("Failed to solve the problem with AI.");
  }
};
