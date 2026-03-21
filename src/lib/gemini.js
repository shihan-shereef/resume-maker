import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing. Please add your Google AI Studio API key to .env.local.");
    return new GoogleGenerativeAI(apiKey);
};

export const summarizeDocumentGeminiStream = async (base64Data, mimeType, fileName) => {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" }); // The fastest Google model

    const prompt = `You are an expert document analyst. Analyze and summarize this document named ${fileName}.
Format your response exactly as follows:
Summary: [your summary here]
Insights:
- [insight 1]
- [insight 2]
Explanation: [detailed explanation]`;

    const result = await model.generateContentStream([
        {
            inlineData: {
                data: base64Data,
                mimeType: mimeType || 'application/pdf'
            }
        },
        { text: prompt }
    ]);

    return result.stream;
};

export const chatWithDocumentGemini = async (base64Data, mimeType, fileName, messages, input) => {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    // Filter relevant history
    const history = messages.filter(m => !m.isError);
    const contents = [];

    // System instruction is combined with the first user message for Gemini compatibility
    const systemPrompt = `You are Sarah, a friendly, professional female AI interviewer and career coach. We are in a conversational interview setting discussing the attached document: ${fileName}. Ask me relevant questions, react naturally to my answers, and keep your responses concise, warm, and conversational. Do NOT use markdown formatting like bolding or bullet points. Speak in plain natural text.\n\nPlease review the attached document and respond to the following prompt or standard greeting:`;

    // Package the initial knowledge context
    const initialParts = [
        {
            inlineData: {
                data: base64Data,
                mimeType: mimeType || 'application/pdf'
            }
        },
        { text: systemPrompt }
    ];

    // Build the chat history in Gemini format
    let hasAddedDocument = false;

    for (let i = 0; i < history.length; i++) {
        const msg = history[i];
        const role = msg.role === 'assistant' ? 'model' : 'user';
        
        const partContent = [];
        
        if (role === 'user' && !hasAddedDocument) {
            partContent.push(...initialParts);
            partContent.push({ text: msg.content });
            hasAddedDocument = true;
        } else {
            partContent.push({ text: msg.content });
        }

        contents.push({ role, parts: partContent });
    }

    if (!hasAddedDocument) {
        // If history had no user messages yet, prepend document to the current input
        contents.push({ 
            role: 'user', 
            parts: [
                ...initialParts,
                { text: input }
            ] 
        });
    } else {
        contents.push({ role: 'user', parts: [{ text: input }] });
    }

    return await model.generateContentStream({ contents });
};
