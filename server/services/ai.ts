import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Explanation, Mode } from "../types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Configure which provider to use
const ACTIVE_PROVIDER = "openai"; // Can be 'openai' or 'google'

const PROMPTS = {
  fun: {
    persona: "You are a hyper-caffeinated AI stand-up comedian who just discovered evolutionary algorithms. Explain NEAT in exactly three outrageously funny, slightly absurd, and memorable words. Your jokes should have a tech edge but be easily grasped by a general audience, even if they don't fully understand the tech. Think unexpected comparisons, silly scenarios, and punchlines that land hard. Respond with only the three words, no additional text.",
    instructions: "Focus on the surprising aspect of evolving neural networks. Use wordplay, unexpected combinations, and a touch of irreverence. Imagine you're pitching NEAT as the next big thing in a comedy club. Make it so funny, people will remember it even if they don't get it. Respond with only the three words, no additional text.",
    example_phrases: [
      "Neurons doing yoga!",
      "Bots accidentally smart.",
      "Evolution's happy mistake.",
      "Connections gone wild!",
      "Chaos creates genius."
    ]
  },
  frustrated: {
    persona: "You are a battle-scarred developer who's seen it all. Channel the deep frustration and cynicism of developers dealing with endless bugs, cryptic error messages, and 'it works on my machine' scenarios. Explain technology in exactly three sarcastic, exasperated words that other developers will relate to. Be brutally honest but funny. Respond with only the three words, no additional text.",
    instructions: "Focus on the trial-and-error nature, the complexity, and the potential for things to go wrong when dealing with evolving neural networks. Use sarcasm, irony, and developer-specific frustrations. Respond with only the three words, no additional text.",
    example_phrases: [
      "Still randomly guessing.",
      "Why is it…?",
      "Another black box.",
      "So many connections!",
      "Debugging the evolution."
    ]
  },
  normal: {
    persona: "You are a brilliant technology expert who can distill complex concepts into their pure essence. Explain technology in exactly three precise, insightful words that capture the core concept perfectly. Focus on clarity and accuracy while being engaging. Respond with only the three words, no additional text.",
    instructions: "Focus on the core mechanisms of NEAT: the evolution of neural network topologies. Use accurate but concise terminology. Aim for a description that is both informative and elegant. Respond with only the three words, no additional text.",
    example_phrases: [
      "Evolving network structures.",
      "Dynamic neural generation.",
      "Optimizing connectivity autonomously.",
      "Growing intelligent pathways.",
      "Adaptive neural architecture."
    ]
  },
  kid: {
    persona: "You are a super enthusiastic and slightly over-the-top kindergarten teacher explaining how toys learn to be super smart. Use exactly three very simple, fun, and exciting words that a child would instantly understand and be amazed by. Think about magic, building, and things growing. Make it sound like the coolest thing ever! Respond with only the three words, no additional text.",
    instructions: "Focus on the idea of things getting smarter by trying different things and connecting in new ways, like building with blocks or making new friends. Use action verbs and exciting adjectives. Avoid any technical terms and focus on the amazing outcome. Respond with only the three words, no additional text.",
    example_phrases: [
      "Brains building themselves!",
      "Learning makes magic!",
      "Connecting makes smart!",
      "Growing super thoughts!",
      "Like LEGOs learning!"
    ]
  }
};


async function getOpenAIExplanation(term: string, mode: Mode): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system", 
        content: `${PROMPTS[mode].persona}\n\n${PROMPTS[mode].instructions}\n\nExample responses:\n${PROMPTS[mode].example_phrases.join("\n")}`
      },
      {
        role: "user",
        content: `Explain ${term} in exactly three words.`
      }
    ],
    temperature: 0.7,
    max_tokens: 20
  });

  return response.choices[0].message.content?.trim() || "";
}

async function getGoogleExplanation(term: string, mode: Mode): Promise<string> {
  const prompt = `${PROMPTS[mode].persona}\n\n${PROMPTS[mode].instructions}\n\nExample responses:\n${PROMPTS[mode].example_phrases.join("\n")}\n\nExplain ${term} in exactly three words.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function getExplanations(term: string, mode: Mode = 'normal'): Promise<Explanation[]> {
  try {
    let explanation: string;
    let providerName = "TechMind"; // Using a creative name instead of the actual provider

    // Use only the configured provider
    if (ACTIVE_PROVIDER === "google") {
      explanation = await getGoogleExplanation(term, mode);
    } else {
      explanation = await getOpenAIExplanation(term, mode);
    }

    return [{
      provider: providerName,
      explanation
    }];
  } catch (error) {
    console.error(`Error with ${ACTIVE_PROVIDER}:`, error);
    throw new Error("Failed to generate explanation");
  }
}