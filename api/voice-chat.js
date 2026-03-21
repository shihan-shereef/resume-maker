/* global process */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { OpenAI } from 'openai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { audio, context, history } = req.body;
    if (!audio) {
        return res.status(400).json({ error: 'Audio data is missing.' });
    }

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key is missing.' });
        }

        const openai = new OpenAI({ apiKey });

        // 1. Save Base64 audio to a temp file for Whisper
        const tempFileName = `audio-${Date.now()}.webm`;
        const tempFilePath = path.join(os.tmpdir(), tempFileName);
        
        fs.writeFileSync(tempFilePath, Buffer.from(audio, 'base64'));

        // 2. Transcription (STT)
        // Whisper API requires a real File or a stream with a filename suffix
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
        });

        // 3. Delete temp file promptly
        fs.unlinkSync(tempFilePath);

        const userText = transcription.text;
        if (!userText || !userText.trim()) {
            return res.status(200).json({ 
                userText: "[Empty]", 
                aiText: "I'm sorry, I couldn't hear that. Could you please repeat yourself?", 
                audio: null 
            });
        }

        // 4. Brain (LLM) - GPT-4o
        // We ground the assistant in the document summary/content provided from frontend
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { 
                    role: "system", 
                    content: `You are Sarah, a professional and warm female AI interviewer talking about a specific document. 
                    Context about the document: ${context}. 
                    Instructions: Keep your answers very concise (under 2 sentences), natural, and warm. 
                    If the answer isn't in the provided context, say "This information is not found in the document." 
                    Do NOT use markdown. Reply only with plain conversational text.` 
                },
                ...(history || []).slice(-4), // Limit history for speed and context
                { role: "user", content: userText }
            ],
            max_tokens: 150
        });

        const aiText = response.choices[0].message.content;

        // 5. Synthesis (TTS) - Fast OpenAI TTS
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "shimmer", // Nice female "Sarah" style voice
            input: aiText,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        const audioBase64 = buffer.toString('base64');

        return res.status(200).json({
            userText,
            aiText,
            audio: audioBase64
        });

    } catch (error) {
        console.error("Voice Chat API Error:", error);
        return res.status(500).json({ 
            error: "Failed to process voice command.", 
            details: error.message 
        });
    }
}
