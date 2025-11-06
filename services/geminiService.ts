import { GoogleGenAI } from "@google/genai";

// FIX: Replaced mock Gemini service with a real implementation using @google/genai, following best practices.
// This service can be used to generate item descriptions automatically.

// Per instructions, initialize with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  generateDescription: async (title: string, category: string): Promise<string> => {
    console.log(`Generating description for: ${title} in category ${category}`);
    
    const prompt = `Write a brief, friendly, and appealing description for a donated item on a platform called "GiveAwayHub".
The item is a "${title}" in the "${category}" category.
The description should be concise (under 40 words), mention it's a donation, and encourage someone to give it a new home.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Recommended model for basic text tasks.
        contents: prompt,
      });
  
      // Extract text directly from the response as per guidelines.
      return response.text;
    } catch (error) {
      console.error("Error generating description with Gemini API:", error);
      // Fallback to a generic description in case of an API error.
      return `A wonderful ${title} looking for a new home! This item is in the ${category} category and is ready to be used and enjoyed.`;
    }
  },
};
