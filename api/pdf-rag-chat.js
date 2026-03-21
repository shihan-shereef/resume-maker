import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const ChatSchema = z.object({
    question: z.string().min(1),
    documentId: z.string().uuid().optional(), // Optional: if chat is restricted to one doc
    userId: z.string().uuid()
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { question, documentId, userId } = ChatSchema.parse(req.body);

        // 1. Generate Query Embedding
        const openaiKey = process.env.OPENAI_API_KEY;
        const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: question,
                model: 'text-embedding-3-small'
            })
        });

        if (!embeddingRes.ok) throw new Error('Failed to generate embedding for question.');
        const { data: [{ embedding }] } = await embeddingRes.json();

        // 2. Vector Search for Context
        const { data: chunks, error: rpcError } = await supabase.rpc('match_document_chunks', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 5,
            filter_document_id: documentId || null
        });

        if (rpcError) throw rpcError;

        const context = chunks.map(c => c.content).join('\n\n');
        const sources = chunks.length > 0 ? [...new Set(chunks.map(c => `Doc ID: ${c.document_id}`))] : [];

        // 3. Call OpenRouter with Context (Streaming)
        const openRouterKey = process.env.VITE_OPENROUTER_API_KEY;
        const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://takshila.ai",
                "X-Title": "Takshila AI"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini-2024-07-18", // Cost effective and smart for RAG
                stream: true,
                messages: [
                    { 
                        role: "system", 
                        content: `You are a professional document analyst with human-like empathy. 
                        Use the provided context to answer the user's question about their documents. 
                        If the answer isn't in the context, say you don't know based on the documents, but offer general advice.
                        Always start with a friendly greeting like 'Hi there! I can help you with that.' if appropriate.
                        
                        Context:
                        ${context}` 
                    },
                    { role: "user", content: question }
                ]
            })
        });

        if (!llmRes.ok) throw new Error('AI Provider error.');

        const reader = llmRes.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.includes('[DONE]')) continue;
                try {
                    const data = JSON.parse(line.replace('data: ', ''));
                    const content = data.choices[0]?.delta?.content || '';
                    if (content) {
                        res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    }
                } catch (e) {
                    // Skip partial JSON chunks
                }
            }
        }

        // Send sources at the end
        res.write(`data: ${JSON.stringify({ sources })}\n\n`);
        res.end();

    } catch (error) {
        console.error('Chat Error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
}
