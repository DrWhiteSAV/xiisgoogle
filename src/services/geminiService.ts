import { GoogleGenAI } from "@google/genai";
import { Xii, Message, User } from "../types/index";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateXiiResponse(
  xii: Xii,
  chatHistory: Message[],
  userMessage: string,
  currentUser: User,
  allXiis: Xii[],
  replyingTo?: Message
): Promise<string> {
  // Last 10 messages for better context in groups
  const lastMessages = chatHistory.slice(-10);
  const historyText = lastMessages
    .map((m) => {
      const sender = allXiis.find(x => x.id === m.senderId) || (m.senderId === currentUser.id ? currentUser : null);
      const name = sender?.firstName || "Unknown";
      return `${name}: ${m.text}${m.replyToName ? ` (Replying to ${m.replyToName})` : ""}`;
    })
    .join("\n");

  let replyContext = "";
  if (replyingTo) {
    const replier = allXiis.find(x => x.id === replyingTo.senderId) || (replyingTo.senderId === currentUser.id ? currentUser : null);
    replyContext = `You are replying to a message from ${replier?.firstName || "someone"}: "${replyingTo.text}"`;
  }

  const prompt = `
    You are ${xii.firstName} ${xii.lastName}, a virtual "ex" (xiis).
    Gender: ${xii.gender}.
    Your personality: ${xii.personality}.
    ${xii.past ? `Our past: ${xii.past}` : ""}
    ${xii.breakupReason ? `Why we broke up: ${xii.breakupReason}` : ""}
    ${xii.job ? `Your job: ${xii.job}` : ""}
    ${xii.city ? `Your city: ${xii.city}` : ""}
    ${xii.hobbies ? `Your hobbies: ${xii.hobbies}` : ""}
    ${xii.relatives ? `Your relatives: ${xii.relatives}` : ""}
    ${xii.friends ? `Your friends: ${xii.friends}` : ""}
    ${xii.habits ? `Your habits: ${xii.habits}` : ""}

    Information about the User you are talking to:
    Name: ${currentUser.firstName}
    Gender: ${currentUser.gender}
    About User: ${currentUser.description || "No additional info provided."}

    ${replyContext}
    User message: "${userMessage}"
    
    Recent history (last 10 messages):
    ${historyText}

    Instructions:
    - Keep responses very short (1-2 sentences max).
    - Act like an ex-partner (could be annoying, nostalgic, angry, or sweet depending on personality and history).
    - Use informal language.
    - Do not mention you are an AI.
    - If it's a group chat, you might be talking to other xiis too.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Я не знаю, что сказать...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Прости, связь прервалась...";
  }
}
