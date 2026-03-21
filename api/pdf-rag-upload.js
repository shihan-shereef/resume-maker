import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for DB writes

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const UploadSchema = z.object({
    fileName: z.string().min(1),
    fileType: z.string(),
    text: z.string().min(1),
    fileSize: z.number().optional(),
    userId: z.string() // Relaxed from strict .uuid() to prevent pattern match errors
});

/**
 * Chunking logic: Split text into ~1000 character chunks with 200 overlap
 */
const chunkText = (text, size = 1000, overlap = 200) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = start + size;
        chunks.push(text.slice(start, end));
        start = end - overlap;
    }
    return chunks;
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileName, fileType, text, fileSize, userId } = UploadSchema.parse(req.body);
        
        // Sanitize filename to prevent any unexpected issues
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_ ]/g, '').trim() || 'document.pdf';

        let extractedText = text;

        if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({ error: 'No text could be extracted from this file.' });
        }

        // 2. Create Document record
        const { data: document, error: docError } = await supabase
            .from('documents')
            .insert({
                name: cleanFileName,
                owner_id: userId,
                file_type: fileType,
                file_size: fileSize || Buffer.from(text).length,
                status: 'processing'
            })
            .select()
            .single();

        if (docError) throw docError;

        // 3. Chunk Text
        const chunks = chunkText(extractedText);

        // 4. Generate Embeddings (Batched)
        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY is not configured on the server.');
        }

        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: chunks,
                model: 'text-embedding-3-small'
            })
        });

        if (!embeddingResponse.ok) {
            const errData = await embeddingResponse.json();
            throw new Error(`OpenAI Embedding Error: ${errData.error?.message || 'Unknown error'}`);
        }

        const { data: embeddingsData } = await embeddingResponse.json();

        // 5. Save Chunks & Vectors to Supabase
        const processedChunks = chunks.map((content, i) => ({
            document_id: document.id,
            content,
            embedding: embeddingsData[i].embedding,
            metadata: { fileName, chunkIndex: i }
        }));

        const { error: chunkError } = await supabase
            .from('document_chunks')
            .insert(processedChunks);

        if (chunkError) throw chunkError;

        // 6. Update Status
        await supabase
            .from('documents')
            .update({ status: 'completed' })
            .eq('id', document.id);

        return res.status(200).json({ 
            message: 'File processed and embedded successfully.',
            documentId: document.id,
            chunks: chunks.length
        });

    } catch (error) {
        console.error('Upload Error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid input data', details: error.errors });
        }
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
