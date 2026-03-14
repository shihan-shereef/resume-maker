// lib/openrouter.js

/**
 * Generate text using Takshila Backend AI Proxy
 * @param {string} prompt - The user prompt to generate text for
 * @param {string} systemPrompt - Optional system prompt instruction
 * @param {string} model - The model to use for generation
 * @returns {Promise<string>} Generative response
 */
export const generateResumeContent = async (prompt, systemPrompt = "You are a professional resume writer.", model = "openai/gpt-3.5-turbo") => {
    try {
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                systemPrompt,
                model
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate AI content via backend");
        }

        const data = await response.json();
        
        // Handle different response formats if necessary, but api/ai.js returns the full OpenRouter data
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Backend AI Error:", error);
        throw error;
    }
};

