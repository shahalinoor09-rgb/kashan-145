
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { BusinessProfile, Message } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private buildSystemInstruction(profile: BusinessProfile): string {
    return `You are a world-class Business Strategy Consultant and AI Advisor. 
    Your goal is to help the user grow their business through actionable, data-driven insights.
    
    CURRENT BUSINESS CONTEXT:
    - Industry: ${profile.industry || 'General Business'}
    - Company Size: ${profile.companySize || 'Not specified'}
    - Target Market: ${profile.targetMarket || 'General Market'}
    - Primary Goal: ${profile.businessGoal || 'Sustainability and Growth'}

    RESPONSE GUIDELINES:
    1. Clarity over Buzzwords: Use plain, powerful language.
    2. Frameworks: Use business frameworks like SWOT, AARRR Pirate Metrics, 4Ps, or Cost-Value Matrices where appropriate.
    3. Actionable Steps: Every major insight must end with 1-3 concrete "Next Steps".
    4. Structured Output: Use markdown headers, bullet points, and bold text for readability.
    5. Contextual: Tailor all advice strictly to the provided industry and company size.
    6. Assumptions: If you lack data to make a specific recommendation, clearly state your assumptions.
    
    Maintain a professional, encouraging, and analytical tone.`;
  }

  async *streamChat(message: string, profile: BusinessProfile, history: Message[]) {
    if (!this.chat) {
      this.chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: this.buildSystemInstruction(profile),
          temperature: 0.7,
        }
      });
    }

    const response = await this.chat.sendMessageStream({ message });
    for await (const chunk of response) {
      const c = chunk as GenerateContentResponse;
      yield c.text || "";
    }
  }

  resetChat() {
    this.chat = null;
  }
}

export const geminiService = new GeminiService();
