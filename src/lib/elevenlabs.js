/**
 * ElevenLabs Hyper-Realistic Text-to-Speech Utility
 */

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || localStorage.getItem('VITE_ELEVENLABS_API_KEY');
const BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Hyper-Realistic "Actor" Voice IDs
export const VOICES = {
    FATHIMA: 'yj30vwTGJxSHezdAGsv9', // Custom Actor Voice
    SAM: 'onwK4e9ZLuTAKqWW03F9',    // Daniel - Professional & Deep
    INTERVIEWER: 'onwK4e9ZLuTAKqWW03F9', // Daniel - Best for Corporate
    NICOLE: 'AZnzlk1XhkDUDXYG7Sgh', // Nicole - Conversational
};

/**
 * Converts text to hyper-realistic speech using ElevenLabs API
 * @param {string} text - The text to speak
 * @param {string} voiceId - The ID of the voice to use
 * @returns {Promise<string|null>} - Returns a Blob URL for the audio or null if failed
 */
export const textToSpeech = async (text, voiceId = VOICES.INTERVIEWER) => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || localStorage.getItem('VITE_ELEVENLABS_API_KEY');
    
    if (!apiKey || apiKey === 'your_eleven_labs_key_here' || !apiKey.startsWith('sk_')) {
        console.warn("ElevenLabs API Key missing or invalid. Falling back to system voices.");
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
                'accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.35, // Lower for more emotion/expression
                    similarity_boost: 0.85, // Higher for better clarity
                    style: 0.05,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail?.message || 'ElevenLabs API error');
        }

        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('ElevenLabs Error:', error);
        return null;
    }
};
