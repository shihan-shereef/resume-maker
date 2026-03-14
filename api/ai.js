// api/ai.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, systemPrompt, model } = req.body;
    
    // Use process.env for Node.js environment variables on Vercel
    const apiKey = process.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'OpenRouter API key is missing on the server. Please add VITE_OPENROUTER_API_KEY to your Vercel Environment Variables.' 
        });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://takshila.ai",
                "X-Title": "Takshila AI"
            },
            body: JSON.stringify({
                model: model || "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt || "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'AI engine error' });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("OpenRouter Proxy Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
