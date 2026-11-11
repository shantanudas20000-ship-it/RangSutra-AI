import { GoogleGenAI } from "@google/genai";

// Initialize Gemini lazily after dotenv has loaded
let ai = null;

function getAI() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return null;
    }

    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
    }

    return ai;
}

const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

// Demo directions for testing without an API key
const demoDirections = [
    {
        type: "Emotional Direction",
        title: "The Heart of the Idea",
        description: "Explore the emotional meaning behind the original idea.",
        concept: "Build a meaningful experience around human emotions and personal connections.",
        suggestions: [
            "Focus on relatable characters.",
            "Explore the emotional journey.",
            "Use meaningful imagery."
        ]
    },
    {
        type: "Cinematic Direction",
        title: "A Visual Journey",
        description: "Transform the idea into a visually engaging experience.",
        concept: "Use atmosphere, visual storytelling and dramatic progression.",
        suggestions: [
            "Create a memorable opening.",
            "Use vivid visual descriptions.",
            "Develop a strong ending."
        ]
    },
    {
        type: "Experimental Direction",
        title: "Beyond the Ordinary",
        description: "Explore unconventional perspectives and creative possibilities.",
        concept: "Combine unexpected ideas and different storytelling approaches.",
        suggestions: [
            "Experiment with unusual perspectives.",
            "Try a non-linear structure.",
            "Explore symbolic elements."
        ]
    }
];

// Common Gemini request function
async function askGemini(prompt) {
    const client = getAI();

    if (!client) {
        return null;
    }

    const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.8,
            maxOutputTokens: 2500
        }
    });

    const responseText = response.text;

    if (!responseText) {
        throw new Error("Gemini returned an empty response.");
    }

    return JSON.parse(responseText);
}

// Generate exactly three creative directions
export async function generateDirections(data) {
    if (!getAI()) {
        return {
            mode: "demo",
            directions: demoDirections.map(item => ({
                ...item,
                description:
                    `${item.description} Your idea: ${data.idea.slice(0, 120)}`
            }))
        };
    }

    const prompt = `
You are RangSutra AI, a creative collaboration assistant.

Core philosophy:
AI amplifies human imagination, never replaces it.

Original idea: ${data.idea}
Project title: ${data.title || "Untitled"}
Category: ${data.category}
Language: ${data.language}
Additional instructions: ${data.instructions || "None"}

Generate EXACTLY THREE distinct creative directions:

1. Emotional Direction
2. Cinematic Direction
3. Experimental Direction

Return valid JSON in this structure:

{
  "directions": [
    {
      "type": "Emotional Direction",
      "title": "A short title",
      "description": "A description",
      "concept": "The creative concept",
      "suggestions": [
        "Suggestion 1",
        "Suggestion 2",
        "Suggestion 3"
      ]
    }
  ]
}

Requirements:
- Exactly three objects in the directions array.
- Use the requested language: ${data.language}.
- Each direction must be genuinely different.
- Respect the user's original idea.
- Never copy existing copyrighted stories or lyrics.
`;

    const result = await askGemini(prompt);

    if (
        !result ||
        !Array.isArray(result.directions) ||
        result.directions.length !== 3
    ) {
        throw new Error("Invalid AI directions response.");
    }

    return {
        mode: "gemini",
        directions: result.directions
    };
}

// Rewrite selected text
export async function rewriteText(data) {
    if (!getAI()) {
        return {
            mode: "demo",
            suggestion: `Demo placeholder suggestion: ${data.text}`
        };
    }

    const prompt = `
Rewrite the following text in ${data.language || "English"}.

Preserve the original meaning and the creator's voice.
Do not introduce unrelated ideas.

Text:
${data.text}

Instruction:
${data.instruction || "Make it clearer and more engaging."}

Return valid JSON:
{
    "suggestion": "Your rewritten text"
}
`;

    const result = await askGemini(prompt);

    if (!result || typeof result.suggestion !== "string") {
        throw new Error("Invalid rewrite response from Gemini.");
    }

    return {
        mode: "gemini",
        suggestion: result.suggestion
    };
}

// Improve grammar and readability
export async function improveText(data) {
    if (!getAI()) {
        return {
            mode: "demo",
            suggestion: `Demo placeholder suggestion: ${data.text}`
        };
    }

    const prompt = `
Improve grammar, clarity and readability of this text.

Preserve the creator's original meaning and writing style.

Language:
${data.language || "English"}

Text:
${data.text}

Return valid JSON:
{
    "suggestion": "The improved text"
}
`;

    const result = await askGemini(prompt);

    if (!result || typeof result.suggestion !== "string") {
        throw new Error("Invalid improvement response from Gemini.");
    }

    return {
        mode: "gemini",
        suggestion: result.suggestion
    };
}