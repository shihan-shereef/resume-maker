export const generateResumeContent = async (prompt, systemPrompt = "You are a professional resume writer.", model = "openai/gpt-3.5-turbo") => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('VITE_OPENROUTER_API_KEY');
    
    if (!apiKey) {
        throw new Error("OpenRouter API key is missing. Please add it to your .env file or Settings.");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // Required by OpenRouter for ranking
                "X-Title": "ResumeFlow App" // Optional identifier
            },
            body: JSON.stringify({
                model: model, // Use the provided model, defaulting to gpt-3.5-turbo
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
