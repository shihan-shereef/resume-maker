import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    Upload, FileText, FileUp, Zap, Loader2, Download, 
    Trash2, CheckCircle, ChevronRight, List, MessageSquare, 
    Send, Plus, MoreVertical, Search, Bot, User, CornerDownRight,
    ArrowLeft, SplitSquareVertical, Sparkles, Files, Volume2, VolumeX, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { extractResumeText } from '../lib/pdfjs';
import LoadingMascot from '../components/common/LoadingMascot';

const PdfSummarizerPage = () => {
    // --- State ---
    const [viewMode, setViewMode] = useState('chat'); // 'chat', 'summarizer', 'converter'
    const [documents, setDocuments] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // Default to ON for interviews
    const fileInputRef = useRef(null);

    // Chat State
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: "Hello, how can I help you with this document?", timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const chatEndRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Summarizer State
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming]);

    // --- Voice Logic ---
    const speak = async (text) => {
        if (!isVoiceEnabled || !text) return;
        
        console.log("Sarah is attempting to speak:", text);
        
        // --- 1. Attempt High Quality ElevenLabs ---
        try {
            const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
            if (!apiKey) throw new Error("Missing ElevenLabs Key");

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`, {
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: { stability: 0.5, similarity_boost: 0.7 }
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play().catch(e => {
                    console.warn("Autoplay blocked, falling back to browser voice...", e);
                    speakNative(text);
                });
                return;
            }
        } catch (err) {
            console.error("ElevenLabs Error, using fallback:", err);
        }

        // --- 2. Fallback to Browser Native Voice (Always Works) ---
        speakNative(text);
    };

    const speakNative = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop any pending speech
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find a nice female voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Female'));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher for "Sarah" persona
        window.speechSynthesis.speak(utterance);
    };

    // --- Speak Greeting on First Doc Interaction or Load ---
    useEffect(() => {
        if (isVoiceEnabled && messages.length === 1 && viewMode === 'chat') {
            // Short delay to ensure browser speech engine is ready
            const timer = setTimeout(() => speak(messages[0].content), 1000);
            return () => clearTimeout(timer);
        }
    }, [isVoiceEnabled, activeDoc]);

    // --- Voice Assistant Logic (Using Native Browser Web Speech API) ---
    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Your browser does not support voice recognition. Please use Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcribed text:", transcript);
            if (transcript) {
                await handleVoiceInteraction(transcript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Recognition Error:", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                setError("Microphone access denied. Please allow it in settings.");
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopRecording = () => {
        // Recognition stops automatically on onresult, but we can call stop() if needed
        // For a toggle-style, we can use a ref.
    };

    const handleVoiceInteraction = async (userText) => {
        setIsProcessing(true);
        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) throw new Error("VITE_OPENROUTER_API_KEY is missing.");

            // 1. Add user message to UI
            setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userText, timestamp: new Date() }]);

            // 2. Chat (LLM) - OpenRouter
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://takshila.ai",
                    "X-Title": "Takshila Voice Agent"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-lite-001",
                    messages: [
                        { 
                            role: "system", 
                            content: `You are Sarah, a professional and warm female AI interviewer. 
                            Context: ${summaryData?.general || activeDoc?.content?.substring(0, 5000)}. 
                            Keep answers very concise (max 2 sentences) and conversational. Reply with plain text only.` 
                        },
                        ...messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
                        { role: "user", content: userText }
                    ],
                    max_tokens: 150
                })
            });

            const data = await response.json();
            const aiText = data.choices?.[0]?.message?.content;

            if (aiText) {
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: aiText, timestamp: new Date() }]);
                // 3. Play audio via ElevenLabs
                speak(aiText);
            }
        } catch (err) {
            console.error("Voice Agent Error:", err);
            setError("I couldn't process that. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Data Fetching ---
    const fetchDocuments = useCallback(async () => {
        // Removed server-side document fetching entirely.
        // We now rely solely on local state `documents` populated via `handleFileUpload`.
    }, []);

    useEffect(() => {
        // No-op. Documents array starts empty on page load.
    }, [fetchDocuments]);

    // --- Handlers ---
    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        
        setUploading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();

        for (const file of files) {
            try {
                // Sanitize filename on client as well to be safe
                const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, '').trim() || 'document.pdf';

                // Extract text on the client side natively
                const extractedText = await extractResumeText(file);
                
                const newDoc = {
                    id: Date.now().toString() + '-' + Math.random().toString().slice(2, 6),
                    name: cleanFileName,
                    content: extractedText || 'No readable text identified.', 
                    mimeType: file.type || 'application/pdf',
                    status: 'completed'
                };

                setDocuments(prev => [newDoc, ...prev]);
                handleSummarize(newDoc);
            } catch (err) {
                console.error("Upload error:", err);
                setError(`Failed to process ${file.name}: ${err.message}`);
            }
        }
        setUploading(false);
    };

    const handleDeleteDoc = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to remove this document?')) return;

        setDocuments(prev => prev.filter(d => d.id !== id));
        if (activeDoc?.id === id) setActiveDoc(null);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        const { data: { user } } = await supabase.auth.getUser();
        const userMsg = { id: Date.now(), role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsStreaming(true);

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) throw new Error("VITE_OPENROUTER_API_KEY is not configured.");

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://takshila.ai",
                    "X-Title": "Takshila RAG Chat"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-lite-001",
                    stream: true,
                    max_tokens: 1500, // Reduced limit to prevent credit reservation errors
                    messages: [
                        { role: "system", content: `You are Sarah, a friendly, professional female AI interviewer and career coach. We are in a conversational interview setting discussing the following resume/document: ${activeDoc.name}. Ask me relevant questions, react naturally to my answers, and keep your responses concise, warm, and conversational. Do NOT use markdown formatting like bolding or bullet points. Speak in plain natural text. Context:\n\n${activeDoc.content?.substring(0, 30000)}` },
                        ...messages.filter(m => !m.isError).map(m => ({ role: m.role, content: m.content })),
                        { role: "user", content: input }
                    ]
                })
            });

            if (!response.ok) throw new Error('Chat failed');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMsgContent = "";
            let aiMsgId = Date.now() + 1;

            setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date() }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(l => l.trim().startsWith('data: '));

                for (const line of lines) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (dataStr === '[DONE]') continue;
                    
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.choices?.[0]?.delta?.content) {
                            aiMsgContent += data.choices[0].delta.content;
                            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiMsgContent } : m));
                        }
                    } catch(e) {}
                }
            }
            if (isVoiceEnabled) speak(aiMsgContent);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [...prev, { id: Date.now() + 2, role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', isError: true }]);
        } finally {
            setIsStreaming(false);
        }
    };

    const handleSummarize = async (doc) => {
        setSummaryLoading(true);
        setViewMode('summarizer');
        setActiveDoc(doc);
        setSummaryData(null);

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) throw new Error("VITE_OPENROUTER_API_KEY is not configured.");

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://takshila.ai",
                    "X-Title": "Takshila RAG Summarizer"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-lite-001", 
                    stream: true,
                    max_tokens: 1000, // Explicitly capped for summarization
                    messages: [
                        { role: "system", content: "You are an expert document analyst. Format your response exactly as follows:\nSummary: [your summary here]\nInsights:\n- [insight 1]\n- [insight 2]\nExplanation: [detailed explanation]" },
                        { role: "user", content: `Analyze and summarize this document:\nName: ${doc.name}\n\nContent:\n${doc.content?.substring(0, 30000)}` }
                    ]
                })
            });

            if (!response.ok) throw new Error('Summarization failed');
            setSummaryLoading(false); // Turn off loader instantly

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(l => l.trim().startsWith('data: '));

                for (const line of lines) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (dataStr === '[DONE]') continue;
                    
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.choices?.[0]?.delta?.content) {
                            fullText += data.choices[0].delta.content;
                            
                            const summaryMatch = fullText.match(/Summary:\s*([\s\S]*?)(?=Insights:|$)/i);
                            const insightsMatch = fullText.match(/Insights:\s*([\s\S]*?)(?=Explanation:|$)/i);
                            const explanationMatch = fullText.match(/Explanation:\s*([\s\S]*)/i);

                            setSummaryData({
                                general: summaryMatch?.[1]?.trim() || fullText.split('Insights:')[0].replace(/Summary:\s*/i, '').trim(),
                                insights: insightsMatch?.[1]?.trim() ? insightsMatch[1].trim().split('\n').filter(l => l.trim()).map(l => l.replace(/^[-*•]\s*/, '')) : [],
                                explanation: explanationMatch?.[1]?.trim() || ''
                            });
                        }
                    } catch(e) {}
                }
            }
        } catch (err) {
            console.error("Gemini Summarize Error:", err);
            setError(err.message || "Failed to generate summary.");
        } finally {
            setSummaryLoading(false);
        }
    };

    // --- Sub-Components ---
    const renderSideBar = () => (
        <div style={{ width: '320px', borderRight: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div style={{ padding: '24px 20px', borderBottom: '1px solid #f8fafc' }}>
                <button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    style={{ 
                        width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', 
                        fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer',
                        boxShadow: '0 8px 20px -6px rgba(255, 92, 0, 0.4)', transition: '0.2s'
                    }}
                >
                    {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Upload Documents
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} multiple accept=".pdf,.txt" />
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', margin: '16px 20px', borderRadius: '10px' }}>
                <Search size={16} color="#94a3b8" />
                <input 
                    type="text" 
                    placeholder="Search docs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }} 
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                    Recent Uploads ({documents.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(doc => (
                        <motion.div 
                            key={doc.id}
                            whileHover={{ x: 4 }}
                            onClick={() => { setActiveDoc(doc); setViewMode('chat'); }}
                            style={{ 
                                padding: '12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                                background: activeDoc?.id === doc.id ? '#fff' : 'transparent',
                                border: activeDoc?.id === doc.id ? '1px solid #e2e8f0' : '1px solid transparent',
                                boxShadow: activeDoc?.id === doc.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                             }}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <FileText size={18} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.status === 'completed' ? 'AI Indexed' : doc.status}</div>
                            </div>
                            <button onClick={(e) => handleDeleteDoc(doc.id, e)} style={{ border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}>
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMainContent = () => {
        if (error) {
            return (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginBottom: '24px' }}>
                        <Zap size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#ef4444' }}>Upload Failed</h2>
                    <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '24px' }}>{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="btn-primary" style={{ padding: '12px 32px', borderRadius: '12px' }}>
                        Try Again
                    </button>
                    <div style={{ marginTop: '32px', padding: '16px', background: '#f8fafc', borderRadius: '12px', textAlign: 'left', maxWidth: '500px', fontSize: '0.85rem', color: '#475569' }}>
                        <strong>Developer Note:</strong> If you see "Unexpected token &lt; in JSON" during local development, it means the <code>/api</code> endpoints aren't running. Stop <code>npm run dev</code> and run <code>npm run dev:full</code> (or <code>vercel dev</code>) instead to serve the API functions.
                    </div>
                </div>
            );
        }

        if (!activeDoc && documents.length > 0) {
            return (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', marginBottom: '24px' }}>
                        <Files size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Select a Document</h2>
                    <p style={{ color: '#64748b', maxWidth: '320px' }}>Select an indexed document from the sidebar to start chatting or generate summaries.</p>
                </div>
            );
        }

        if (documents.length === 0 && !uploading) {
            return (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                     <div 
                        onClick={() => fileInputRef.current.click()}
                        style={{ padding: '80px', border: '2px dashed #e2e8f0', borderRadius: '32px', cursor: 'pointer', transition: '0.3s', background: '#fff' }}
                        className="hover-lift"
                     >
                        <FileUp size={64} color="var(--primary)" style={{ marginBottom: '24px', opacity: 0.5 }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Welcome to Takshila Intel</h2>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>Upload your first PDF or TXT file to train your personal AI.</p>
                        <button className="btn-primary" style={{ padding: '16px 40px', borderRadius: '16px' }}>Get Started</button>
                     </div>
                </div>
            );
        }

        if (uploading && documents.length === 0) {
            return (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingMascot message="Our AI is deconstructing and indexing your document for RAG processing..." />
                </div>
            );
        }

        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', position: 'relative' }}>
                {/* Header Toggle */}
                <div style={{ padding: '16px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 92, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Bot size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>Talking to: {activeDoc.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={10} /> Knowledge Base Active
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '100px', display: 'flex', gap: '4px' }}>
                        <button 
                            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                            style={{ 
                                width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: isVoiceEnabled ? 'var(--primary)' : '#fff', 
                                color: isVoiceEnabled ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginRight: '8px'
                            }}
                        >
                            {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>
                        <button 
                            onClick={() => setViewMode('chat')}
                            style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', background: viewMode === 'chat' ? '#fff' : 'transparent', color: viewMode === 'chat' ? 'var(--primary)' : '#64748b', boxShadow: viewMode === 'chat' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
                            <MessageSquare size={14} style={{ marginRight: '6px' }} /> AI Chat
                        </button>
                        <button 
                            onClick={() => handleSummarize(activeDoc)}
                            style={{ padding: '6px 16px', borderRadius: '100px', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', background: viewMode === 'summarizer' ? '#fff' : 'transparent', color: viewMode === 'summarizer' ? 'var(--primary)' : '#64748b', boxShadow: viewMode === 'summarizer' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
                            <Zap size={14} style={{ marginRight: '6px' }} /> Summarize
                        </button>
                    </div>
                </div>

                {/* View Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                    {viewMode === 'chat' ? (
                        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ 
                                            display: 'flex', 
                                            gap: '16px', 
                                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <div style={{ 
                                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                            background: msg.role === 'user' ? '#f05523' : '#00BCD4',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                        }}>
                                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                        </div>
                                        <div style={{ 
                                            maxWidth: '70%', padding: '16px', borderRadius: '18px',
                                            background: msg.role === 'user' ? '#f05523' : '#fff',
                                            color: msg.role === 'user' ? '#fff' : '#1e293b',
                                            border: msg.role === 'user' ? 'none' : '1px solid #eef2f6',
                                            boxShadow: msg.role === 'user' ? '0 4px 12px rgba(240, 85, 35, 0.2)' : '0 4px 12px rgba(0,0,0,0.02)',
                                            fontSize: '0.95rem', lineHeight: 1.6,
                                            borderTopRightRadius: msg.role === 'user' ? '4px' : '18px',
                                            borderTopLeftRadius: msg.role === 'user' ? '18px' : '4px'
                                        }}>
                                            {msg.content}
                                            {msg.id === messages[messages.length-1].id && isStreaming && (
                                                <span style={{ display: 'inline-block', width: '2px', height: '18px', background: 'currentColor', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={chatEndRef} />
                        </div>
                    ) : (
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {summaryLoading ? (
                                <div style={{ padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                                    <p style={{ marginTop: '20px', fontWeight: 600 }}>Deep-analyzing document patterns...</p>
                                </div>
                            ) : summaryData ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
                                     <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <FileText size={20} color="var(--primary)" /> Executive Summary
                                        </h2>
                                        <p style={{ lineHeight: '1.8', color: '#334155' }}>{summaryData.general}</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Sparkles size={18} color="var(--accent)" /> Insights
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {summaryData.insights.map((ins, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: '#475569' }}>
                                                        <CheckCircle size={14} color="var(--primary)" style={{ marginTop: '4px' }} /> {ins}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <SplitSquareVertical size={18} color="#6366f1" /> Technical Depth
                                            </h3>
                                            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{summaryData.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                {viewMode === 'chat' && (
                    <div style={{ padding: '24px 32px 32px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
                        <form 
                            onSubmit={handleSendMessage}
                            style={{ 
                                maxWidth: '800px', margin: '0 auto', display: 'flex', background: '#f8fafc', 
                                border: '1px solid #eef2f6', borderRadius: '18px', padding: '10px 10px 10px 24px', alignItems: 'center', gap: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                            }}>
                            <input 
                                type="text" 
                                placeholder={isListening ? "Listening..." : isProcessing ? "Thinking..." : "Talk to me or type here..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isStreaming || isListening || isProcessing}
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
                            />
                            <button 
                                type="button"
                                onClick={startRecording}
                                style={{ 
                                    border: 'none', background: 'transparent', color: isListening ? 'var(--primary)' : '#94a3b8', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 8px', transition: '0.2s'
                                }}
                                title="Click to Talk to Sarah"
                            >
                                <Mic size={24} style={{ animation: isListening ? 'pulse 1.5s infinite' : 'none' }} />
                            </button>
                            <button 
                                type="submit"
                                disabled={!input.trim() || isStreaming || isListening || isProcessing}
                                style={{ 
                                    width: '44px', height: '44px', borderRadius: '14px', background: input.trim() ? 'var(--primary)' : '#cbd5e1', 
                                    color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s'
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '12px' }}>
                            Takshila AI Document Assistant · Powered by RAG Indexing
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', background: '#fff', borderRadius: '24px', overflow: 'hidden', height: 'calc(100vh - 120px)', border: '1px solid #f1f5f9' }} className="animate-fade-in">
            <style>{`
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
                .hover-lift:hover { transform: translateY(-4px); }
            `}</style>
            {renderSideBar()}
            {renderMainContent()}
        </div>
    );
};

export default PdfSummarizerPage;
