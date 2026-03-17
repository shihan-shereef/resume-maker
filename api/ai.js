// api/ai.js
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Simple in-memory rate limiter.
// WARNING: This is not a robust solution for a serverless environment, as each
// invocation may run on a different instance. For a production environment,
// consider using a centralized data store like Redis or a database.
const rateLimitMap = new Map();
const LIMIT = 5; // 5 requests per minute for AI
const WINDOW = 60 * 1000;

const rateLimit = (ip) => {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const recentTimestamps = timestamps.filter(ts => now - ts < WINDOW);
    
    if (recentTimestamps.length >= LIMIT) {
        return { limited: true, retryAfter: Math.ceil((WINDOW - (now - recentTimestamps[0])) / 1000) };
    }
    
    recentTimestamps.push(now);
    rateLimitMap.set(ip, recentTimestamps);
    return { limited: false };
};

const AiSchema = z.object({
    prompt: z.string().min(1).max(5000),
    systemPrompt: z.string().max(2000).optional(),
    model: z.enum([
        "openai/gpt-3.5-turbo",
        "openai/gpt-4",
        "anthropic/claude-2"
    ]).optional()
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Basic IP detection for Vercel
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous';
    const { limited, retryAfter } = rateLimit(ip);
    
    if (limited) {
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({ error: `Too many requests. Please try again in ${retryAfter}s.` });
    }

    try {
        const validatedData = AiSchema.parse(req.body);
        const { prompt, systemPrompt, model } = validatedData;
        
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ 
                error: '[SERVER_ERROR] OpenRouter API key is missing in Vercel Settings.' 
            });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                // TODO: The 'HTTP-Referer' and 'X-Title' headers are hardcoded.
                // You may want to make these configurable or remove them if they are not necessary.
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

        if (data.choices && data.choices[0] && data.choices[0].message) {
            data.choices[0].message.content = DOMPurify.sanitize(data.choices[0].message.content);
        }
        return res.status(200).json(data);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid input data', details: error.errors });
        }
        console.error("OpenRouter Proxy Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
