// lib/openrouter.js

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * Generate text using OpenRouter API
 * @param {string} prompt - The user prompt to generate text for
 * @param {string} systemPrompt - Optional system prompt instruction
 * @returns {Promise<string>} Generative response
 */
export const generateResumeContent = async (prompt, systemPrompt = "You are a professional resume writer.") => {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key is missing. Please add it to your .env file.");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // Required by OpenRouter for ranking
                "X-Title": "ResumeFlow App" // Optional identifier
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // You can switch this to other models supported by OpenRouter
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to generate AI content");
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw error;
    }
};
