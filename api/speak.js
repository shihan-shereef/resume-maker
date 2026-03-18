// api/speak.js
/* global process, Buffer */
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Simple in-memory rate limiter.
// WARNING: This is not a robust solution for a serverless environment, as each
// invocation may run on a different instance. For a production environment,
// consider using a centralized data store like Redis or a database.
const rateLimitMap = new Map();
const LIMIT = 30; // 30 requests per minute for speech
const WINDOW = 60 * 1000;
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';
const DEFAULT_VOICE_SETTINGS = {
    stability: 0.4,
    similarity_boost: 0.88,
    style: 0.28,
    use_speaker_boost: true,
    speed: 0.96,
};

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

const SpeakSchema = z.object({
    text: z.string().min(1).max(2000),
    voiceId: z.string().min(1),
    modelId: z.string().min(1).optional(),
    voiceSettings: z.object({
        stability: z.number().min(0).max(1).optional(),
        similarity_boost: z.number().min(0).max(1).optional(),
        style: z.number().min(0).max(1).optional(),
        use_speaker_boost: z.boolean().optional(),
        speed: z.number().min(0.7).max(1.2).optional(),
    }).optional(),
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous';
    const { limited, retryAfter } = rateLimit(ip);
    
    if (limited) {
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({ error: `Too many requests. Please try again in ${retryAfter}s.` });
    }

    try {
        const validatedData = SpeakSchema.parse(req.body);
        const text = DOMPurify.sanitize(validatedData.text);
        const {
            voiceId,
            modelId = DEFAULT_MODEL_ID,
            voiceSettings = {},
        } = validatedData;
        
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey || apiKey === 'your_eleven_labs_key_here') {
            return res.status(500).json({ error: '[SERVER_ERROR] ElevenLabs API key is missing in Vercel Settings.' });
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
                'accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text,
                model_id: modelId,
                voice_settings: {
                    ...DEFAULT_VOICE_SETTINGS,
                    ...voiceSettings,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.detail || 'ElevenLabs error' });
        }

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(Buffer.from(arrayBuffer));

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid input data', details: error.errors });
        }
        console.error("ElevenLabs Proxy Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
