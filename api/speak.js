// api/speak.js
// Native fetch is available in Node 18+ on Vercel

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, voiceId } = req.body;
    const apiKey = process.env.VITE_ELEVENLABS_API_KEY;

    if (!apiKey || apiKey === 'your_eleven_labs_key_here') {
        return res.status(500).json({ error: '[SERVER_ERROR] ElevenLabs API key is missing in Vercel Settings.' });
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
                'accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.4,
                    similarity_boost: 0.8
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
        console.error("ElevenLabs Proxy Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
