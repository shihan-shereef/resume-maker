/**
 * ElevenLabs Hyper-Realistic Text-to-Speech Utility with Client-side Fallback
 */
/* global process */

export const VOICES = {
    FATHIMA: 'yj30vwTGJxSHezdAGsv9', 
    SAM: 'onwK4e9ZLuTAKqWW03F9',
    INTERVIEWER: 'onwK4e9ZLuTAKqWW03F9',
    NICOLE: 'AZnzlk1XhkDUDXYG7Sgh'
};

export const ELEVENLABS_MODELS = {
    CONVERSATIONAL: 'eleven_multilingual_v2',
};

export const VOICE_PRESETS = {
    PODCAST_HOST: {
        modelId: ELEVENLABS_MODELS.CONVERSATIONAL,
        voiceSettings: {
            stability: 0.34,
            similarity_boost: 0.9,
            style: 0.42,
            use_speaker_boost: true,
            speed: 0.97,
        },
    },
    PODCAST_EXPERT: {
        modelId: ELEVENLABS_MODELS.CONVERSATIONAL,
        voiceSettings: {
            stability: 0.42,
            similarity_boost: 0.88,
            style: 0.28,
            use_speaker_boost: true,
            speed: 0.95,
        },
    },
    INTERVIEWER: {
        modelId: ELEVENLABS_MODELS.CONVERSATIONAL,
        voiceSettings: {
            stability: 0.45,
            similarity_boost: 0.86,
            style: 0.18,
            use_speaker_boost: true,
            speed: 0.96,
        },
    },
};

const LOCAL_DEV_HINT = "If you're running locally, start the app with `npm run dev:full` so the `/api/speak` backend is available.";

/**
 * Convert text to speech using Takshila Backend Proxy or Direct client-side call
 * @param {string} text - The text to convert
 * @param {string} voiceId - The ElevenLabs voice ID
 * @param {{ modelId?: string, voiceSettings?: object }} options
 * @returns {Promise<string|null>} - Returns a Blob URL for the audio or null if failed
 */
export const textToSpeech = async (text, voiceId = VOICES.INTERVIEWER, options = {}) => {
    try {
        const { modelId = ELEVENLABS_MODELS.CONVERSATIONAL, voiceSettings = {} } = options;

        // Try the backend proxy first
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, voiceId, modelId, voiceSettings })
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
                     model_id: modelId,
                     voice_settings: {
                         ...VOICE_PRESETS.INTERVIEWER.voiceSettings,
                         ...voiceSettings,
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
            // Check if backend or frontend has the key to fallback
            const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || (typeof process !== 'undefined' ? process.env.ELEVENLABS_API_KEY : '');
            if (apiKey) {
                console.warn("Backend Voice key missing or error. Falling back to direct client-side TTS...");
                const directResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'xi-api-key': apiKey,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text,
                        model_id: modelId,
                        voice_settings: {
                            ...VOICE_PRESETS.INTERVIEWER.voiceSettings,
                            ...voiceSettings,
                        }
                    })
                });

                if (directResponse.ok) {
                    const blob = await directResponse.blob();
                    return URL.createObjectURL(blob);
                }
            }
            throw new Error('Backend Voice Error or Missing Key');
        }


        const blob = await response.blob();
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Voice Generation Error:", error);
        return null;
    }
};
