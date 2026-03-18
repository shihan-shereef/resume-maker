/**
 * ElevenLabs Hyper-Realistic Text-to-Speech Utility with Client-side Fallback
 */

export const VOICES = {
    FATHIMA: 'yj30vwTGJxSHezdAGsv9', 
    SAM: 'onwK4e9ZLuTAKqWW03F9',
    INTERVIEWER: 'onwK4e9ZLuTAKqWW03F9',
    NICOLE: 'AZnzlk1XhkDUDXYG7Sgh'
};

const LOCAL_DEV_HINT = "If you're running locally, start the app with `npm run dev:full` so the `/api/speak` backend is available.";

/**
 * Convert text to speech using Takshila Backend Proxy or Direct client-side call
 * @param {string} text - The text to convert
 * @param {string} voiceId - The ElevenLabs voice ID
 * @returns {Promise<string|null>} - Returns a Blob URL for the audio or null if failed
 */
export const textToSpeech = async (text, voiceId = VOICES.INTERVIEWER) => {
    try {
        // Try the backend proxy first
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, voiceId })
        });

        if (response.status === 404) {
             // Fallback to direct client-side call if backend is not found
             const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || (typeof process !== 'undefined' ? process.env.ELEVENLABS_API_KEY : '');
             
             if (!apiKey) {
                 console.warn(`Voice backend returned 404. ${LOCAL_DEV_HINT}`);
                 return null;
             }

             console.warn("Voice backend 404 detected. Falling back to direct client-side TTS...");
             
             const directResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                 method: 'POST',
                 headers: {
                     'xi-api-key': apiKey,
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     text,
                     model_id: 'eleven_monolingual_v1',
                     voice_settings: {
                         stability: 0.5,
                         similarity_boost: 0.5,
                     }
                 })
             });

             if (!directResponse.ok) {
                 throw new Error(`Direct TTS call failed (HTTP ${directResponse.status}).`);
             }

             const blob = await directResponse.blob();
             return URL.createObjectURL(blob);
        }

        if (!response.ok) {
            throw new Error('Backend Voice Error');
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Voice Generation Error:", error);
        return null;
    }
};
