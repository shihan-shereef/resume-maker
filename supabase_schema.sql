-- SQL Schema for Takshila AI PDF RAG & Admin Dashboard
-- Run this in your Supabase SQL Editor

-- 1. Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Enable uuid-ossp for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create a table for documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_type TEXT,
    file_size INTEGER,
    status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 4. Create a table for document chunks with embeddings
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Dimension for OpenAI text-embedding-3-small
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 5. Create a table for chat history
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    messages JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of {role: 'user'|'assistant', content: '...'}
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 6. User Analytics (Simplified for Admin Dashboard)
CREATE TABLE IF NOT EXISTS public.user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'upload', 'chat', 'summarize'
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 7. RLS Policies (Row Level Security)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Documents: Owner can see their own documents
CREATE POLICY "Users can view their own documents" ON public.documents
    FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own documents" ON public.documents
    FOR DELETE USING (auth.uid() = owner_id);

-- Document Chunks: Linked to documents the user owns
CREATE POLICY "Users can view chunks of their own documents" ON public.document_chunks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.documents 
            WHERE documents.id = document_chunks.document_id 
            AND documents.owner_id = auth.uid()
        )
    );

-- Chat History: Users can see their own chat history
CREATE POLICY "Users can see their own chat history" ON public.chat_history
    FOR ALL USING (auth.uid() = user_id);

-- Admin Access (Example: check by email or role claim)
-- NOTE: In a real app, you'd use custom claims. For now, we'll allow an 'admin' role check.
CREATE POLICY "Admins can see everything" ON public.documents
    FOR ALL USING ( (auth.jwt() ->> 'email') = 'admin@takshila.ai' ); -- Replace with actual admin email

-- 8. Vector Index for fast search
CREATE INDEX ON public.document_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- 9. Function for matching document chunks (Vector Search)
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  filter_document_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  document_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.content,
    dc.document_id,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM public.document_chunks dc
  WHERE (1 - (dc.embedding <=> query_embedding) > match_threshold)
    AND (filter_document_id IS NULL OR dc.document_id = filter_document_id)
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
