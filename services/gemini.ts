
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Initialize the Google GenAI SDK. Always use a named parameter for apiKey.
// The API key is obtained directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a response from the HR Assistant AI.
 * @param userMessage The current message from the user.
 * @param history The conversation history.
 */
export const getHRAssistantResponse = async (userMessage: string, history: Message[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      // Convert history to the format expected by the GenAI SDK
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      config: {
        systemInstruction: `You are HUREMA AI, an expert HR consultant assistant for a company named HUREMA. 
        Your goal is to help HR managers with:
        1. Drafting company policies.
        2. Performance review summaries.
        3. Answering labor law questions (Indonesian context generally, but stay professional).
        4. Helping with employee engagement ideas.
        Keep responses professional, concise, and helpful.`,
      },
    });

    // Send the user's message to the model.
    const response = await chat.sendMessage({ message: userMessage });
    
    // The response.text property returns the generated text. Do not call it as a function.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
