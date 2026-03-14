/**
 * ElevenLabs Hyper-Realistic Text-to-Speech Utility
 */

/**
 * Hyper-Realistic Voice AI (Backend Powered)
 */
export const VOICES = {
    FATHIMA: 'yj30vwTGJxSHezdAGsv9', 
    SAM: 'onwK4e9ZLuTAKqWW03F9',
    INTERVIEWER: 'onwK4e9ZLuTAKqWW03F9',
    NICOLE: 'AZnzlk1XhkDUDXYG7Sgh'
};

/**
 * Convert text to speech using Takshila Backend Proxy
 * @param {string} text - The text to convert
 * @param {string} voiceId - The ElevenLabs voice ID
 * @returns {Promise<string|null>} - Returns a Blob URL for the audio or null if failed
 */
export const textToSpeech = async (text, voiceId = VOICES.INTERVIEWER) => {
    try {
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, voiceId })
        });

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
