import React, { useState, useRef } from 'react';
import { Youtube, Search, Sparkles, Globe, MessageSquare, AlertTriangle, Headphones, Copy, Check, Play, SkipBack, SkipForward, Pause, Download, Volume2, VolumeX, Clock, Calendar, Type, List, MessageCircle, Maximize2, Minimize2 } from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';
import TranscriptClient from 'youtube-transcript-api';
import LoadingMascot from '../components/common/LoadingMascot';
import { useReactToPrint } from 'react-to-print';

const YoutubeSummarizerAdvanced = () => {
    const [url, setUrl] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [summaryLength, setSummaryLength] = useState('Detailed');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('summary'); 
    
    // Core Data States
    const [videoData, setVideoData] = useState(null);
    const [summaryData, setSummaryData] = useState(null);
    const [podcast, setPodcast] = useState(null);
    
    // Chat States
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Audio / UI States
    const [copied, setCopied] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const summaryRef = useRef();
    const audioObjRef = useRef(null);
    const chatEndRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => summaryRef.current,
    });

    const languages = [
        "English", "Spanish", "French", "German", "Portuguese", "Italian", "Dutch", "Russian", 
        "Arabic", "Hindi", "Malayalam", "Tamil", "Telugu", "Kannada", "Chinese", "Japanese", 
        "Korean", "Indonesian", "Turkish", "Thai", "Vietnamese", "Bengali", "Urdu", "Polish", "Swedish"
    ];

    const langMap = {
        "English": "en-US", "Spanish": "es-ES", "French": "fr-FR", "German": "de-DE",
        "Portuguese": "pt-PT", "Italian": "it-IT", "Dutch": "nl-NL", "Russian": "ru-RU",
        "Arabic": "ar-SA", "Hindi": "hi-IN", "Malayalam": "ml-IN", "Tamil": "ta-IN",
        "Telugu": "te-IN", "Kannada": "kn-IN", "Chinese": "zh-CN", "Japanese": "ja-JP",
        "Korean": "ko-KR", "Indonesian": "id-ID", "Turkish": "tr-TR", "Thai": "th-TH",
        "Vietnamese": "vi-VN", "Bengali": "bn-IN", "Urdu": "ur-PK", "Polish": "pl-PL", "Swedish": "sv-SE"
    };

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // 1. Fetch Metadata (using Noembed for simple public metadata without API keys)
    const fetchVideoMetadata = async (videoId) => {
        try {
            const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            const data = await res.json();
            if (data.error) throw new Error("Could not fetch video metadata.");
            
            setVideoData({
                id: videoId,
                title: data.title,
                author: data.author_name,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            });
            return data.title;
        } catch (e) {
            console.warn("Metadata fetch failed, falling back to ID.", e);
            setVideoData({ id: videoId, title: `YouTube Video (${videoId})`, author: "Unknown", thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` });
            return `Video ${videoId}`;
        }
    };

    // 2. Main Generation Logic
    const handleSummarize = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        setSummaryData(null);
        setPodcast(null);
        setVideoData(null);
        setChatHistory([]);
        setActiveTab('summary');
        
        try {
            const videoId = getYoutubeId(url);
            if (!videoId) throw new Error("Invalid YouTube URL. Please check the link.");

            const fetchedTitle = await fetchVideoMetadata(videoId);
            
            // Try fetching transcript for better accuracy
            let transcriptText = "";
            try {
                const client = new TranscriptClient();
                await client.ready;
                const transcriptData = await client.getTranscript(videoId);
                if (transcriptData && transcriptData.segments) {
                    transcriptText = transcriptData.segments.map(s => s.text).join(' ');
                }
            } catch (tErr) {
                console.warn("Transcript retrieval failed, AI will attempt inference.", tErr);
            }

            // Constructing a mega-prompt for structured output
            const prompt = `Act as an expert Video Intelligence and Transcription Specialist. 
            
            VIDEO ID: ${videoId}
            URL: ${url}
            VIDEO TITLE: ${fetchedTitle}
            TARGET LANGUAGE: ${selectedLanguage}
            SUMMARY LENGTH: ${summaryLength}
            TRANSCRIPT_CONTEXT: ${transcriptText ? transcriptText.substring(0, 15000) : "No direct transcript available. Use search/video knowledge."}
            
            TASK: 
            Analyze the video content thoroughly. You must provide a high-fidelity, EXACT, and EXTREMELY DETAILED summary.
            If transcript is provided, use it as the primary source of truth.
            
            Output strictly in Markdown format, in ${selectedLanguage}.

            # QUICK_SUMMARY
            [Provide a 3-4 sentence high-level executive summary.]

            # STANDARD_SUMMARY
            [Provide a comprehensive overview.]

            # DETAILED_BREAKDOWN
            [Provide a deep analysis. This must be significant if transcript is available.]

            # KEY_POINTS
            - [Major Insight 1]
            - [Major Insight 2]
            - [Major Insight 3]

            # TIMESTAMPS
            [Provide realistic chapters.]
            
            # QUOTES
            > "[Exact or paraphrased impactful quote]"

            # KEYWORDS
            [Keywords list]

            # ACTIONABLE_TAKEAWAYS
            - [Practical advice]`;

            // Using gemini-2.0-flash-001
            const response = await generateResumeContent(prompt, `You are Takshila AI Video Engine. Output EVERYTHING accurately in ${selectedLanguage}. STRICTLY NO PREAMBLES.`, "google/gemini-2.0-flash-001");
            
            if (!response) throw new Error("Analysis failed. The AI could not retrieve video intelligence.");

            parseAndSetSummaryData(response);

        } catch (err) {
            console.error('YouTube error:', err);
            setError(err.message || "Something went wrong. Please ensure the video is public and accessible.");
        } finally {
            setLoading(false);
        }
    };

    // Parser to break the markdown into objects for rendering
    const parseAndSetSummaryData = (markdown) => {
        const sections = {};
        const lines = markdown.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            if (line.trim().startsWith('# ')) {
                currentSection = line.replace('# ', '').trim();
                sections[currentSection] = [];
            } else if (currentSection && line.trim() !== '') {
                sections[currentSection].push(line);
            }
        });

        setSummaryData({
            raw: markdown,
            quick: sections['QUICK_SUMMARY']?.join('\n') || '',
            standard: sections['STANDARD_SUMMARY']?.join('\n') || '',
            detailed: sections['DETAILED_BREAKDOWN']?.join('\n') || '',
            keyPoints: sections['KEY_POINTS'] || [],
            timestamps: sections['TIMESTAMPS'] || [],
            quotes: sections['QUOTES'] || [],
            keywords: sections['KEYWORDS']?.join(' ')?.split(',').map(k => k.trim()) || [],
            takeaways: sections['ACTIONABLE_TAKEAWAYS'] || []
        });
    };

    // 3. Podcast Logic (Untouched core logic, preserved for stability)
    const generatePodcast = async () => {
        if (!summaryData?.raw) return;
        setLoading(true);
        try {
            const prompt = `Convert the following video summary into a dynamic, human-like Podcast Script.
            
            SUMMARY:
            ${summaryData.raw}
            
            PODCAST FORMAT:
            - A conversation between 2 people (Fathima and Sam).
            - Fathima is the host, Sam is the expert.
            - The tone should be natural and engaging.
            - Format each line as "Fathima: [content]" or "Sam: [content]".
            
            CRITICAL LANGUAGE RULE:
            - YOU MUST OUTPUT THE ENTIRE SCRIPT STRICTLY AND ONLY IN ${selectedLanguage}.
            - DO NOT MIX IN ENGLISH OR OTHER LANGUAGES.`;

            const response = await generateResumeContent(prompt, "You are a professional Podcast producer.", "openai/gpt-4o-mini");
            setPodcast(response);
            setActiveTab('podcast');
        } catch (err) {
            setError("Failed to create podcast script.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Video Chat Feature
    const handleChat = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !summaryData) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsChatLoading(true);

        try {
            const prompt = `Based on the following video knowledge base, answer the user's question accurately in ${selectedLanguage}. If the answer is not in the knowledge base, state that clearly but try to infer from the context.
            
            KNOWLEDGE BASE:
            ${summaryData.raw}
            
            USER QUESTION:
            ${userMessage}
            
            Answer directly without preamble. Make it conversational but highly informative.`;

            const response = await generateResumeContent(prompt, "You are a helpful AI assistant specialized in answering questions about a specific video.", "openai/gpt-4o-mini");
            
            setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
            
            // Auto scroll to bottom
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);

        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error while trying to answer that." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Text to Speech logic (preserved from original)
    const toggleSpeech = () => {
        if (isReading) {
            if (audioObjRef.current) {
                audioObjRef.current.pause();
                audioObjRef.current = null;
            }
            window.speechSynthesis.cancel();
            setIsReading(false);
            setAudioProgress(0);
            return;
        }

        const textToRead = activeTab === 'summary' ? summaryData.standard : podcast;
        if (!textToRead) return;

        const utterances = textToRead.split('\n').filter(line => line.trim().length > 0);
        let currentIndex = 0;
        
        const speakNext = () => {
            if (currentIndex >= utterances.length) {
                setIsReading(false);
                setAudioProgress(100);
                return;
            }

            let text = utterances[currentIndex];
            const cleanText = text.replace(/Fathima:|Sam:|#|\*|-|>/gi, '').trim();
            if(!cleanText) {
                 currentIndex++;
                 speakNext();
                 return;
            }

            const targetLangCode = langMap[selectedLanguage] || 'en-US';
            const gtxLang = targetLangCode.split('-')[0];
            const ttsUrl = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${gtxLang}&q=${encodeURIComponent(cleanText.substring(0, 200))}`;
            
            const audio = new Audio(ttsUrl);
            audioObjRef.current = audio;

            if (activeTab === 'podcast') {
                if (text.includes('Fathima:')) audio.playbackRate = 1.05;
                if (text.includes('Sam:')) audio.playbackRate = 0.95;
            }

            audio.onended = () => {
                currentIndex++;
                setAudioProgress((currentIndex / utterances.length) * 100);
                speakNext();
            };

            audio.onerror = () => {
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = targetLangCode;
                utterance.onend = () => {
                    currentIndex++;
                    setAudioProgress((currentIndex / utterances.length) * 100);
                    speakNext();
                };
                window.speechSynthesis.speak(utterance);
            };

            audio.play().catch(err => {
                audio.onerror(); 
            });
        };

        setIsReading(true);
        speakNext();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ff0000', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                    <Youtube size={16} /> Advanced Video Intelligence
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Takshila <span className="gradient-text">Video Analyzer 3.0</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Multi-layered AI summaries, timestamp chapters, key insights, and conversational video chat.
                </p>
            </header>

            {loading ? (
                <div className="glass-card" style={{ padding: '80px', background: 'white', border: 'none' }}>
                    <LoadingMascot message="Running Deep Cognitive Analysis on Video..." />
                </div>
            ) : (
                <>
                    {/* Control Panel */}
                    <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Video URL</label>
                                <div style={{ position: 'relative' }}>
                                    <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ paddingLeft: '56px', height: '64px', borderRadius: '100px' }}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', alignItems: 'flex-end' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Globe size={18} /> Translate To
                                    </label>
                                    <select className="form-input" style={{ height: '56px', borderRadius: '100px', padding: '0 24px' }} value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                                        {languages.map(lang => ( <option key={lang} value={lang}>{lang}</option> ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <List size={18} /> Detail Level
                                    </label>
                                    <select className="form-input" style={{ height: '56px', borderRadius: '100px', padding: '0 24px' }} value={summaryLength} onChange={(e) => setSummaryLength(e.target.value)}>
                                        <option value="Short">Brief / Concise</option>
                                        <option value="Medium">Standard</option>
                                        <option value="Detailed">Deep Dive / Detailed</option>
                                    </select>
                                </div>
                                <button className="btn-primary" style={{ height: '56px', borderRadius: '100px', width: '100%', fontSize: '1rem' }} onClick={handleSummarize} disabled={!url}>
                                    Run Analysis <Sparkles size={18} />
                                </button>
                            </div>
                            
                            {error && (
                                <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <AlertTriangle size={18} /> {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {summaryData && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
                            
                            {/* Left Column: Main Content */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                
                                {/* Video Metadata Header */}
                                {videoData && (
                                    <div className="glass-card" style={{ background: 'white', padding: '0', overflow: 'hidden', display: 'flex' }}>
                                        <img src={videoData.thumbnail} alt="Thumbnail" style={{ width: '250px', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>{videoData.title}</h2>
                                            <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Type size={16} /> {videoData.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Results Area */}
                                <div className="glass-card" style={{ padding: '0', background: 'white', border: 'none', overflow: 'hidden' }}>
                                    <div style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', background: '#f8fafc' }}>
                                        <button onClick={() => setActiveTab('summary')} style={{ flex: 1, padding: '20px', border: 'none', background: activeTab === 'summary' ? 'white' : 'transparent', fontWeight: 800, color: activeTab === 'summary' ? 'var(--primary)' : '#64748b', borderBottom: activeTab === 'summary' ? '3px solid var(--primary)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <MessageSquare size={18} /> Deep Analysis
                                        </button>
                                        <button onClick={() => setActiveTab('chat')} style={{ flex: 1, padding: '20px', border: 'none', background: activeTab === 'chat' ? 'white' : 'transparent', fontWeight: 800, color: activeTab === 'chat' ? 'var(--primary)' : '#64748b', borderBottom: activeTab === 'chat' ? '3px solid var(--primary)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <MessageCircle size={18} /> Chat With Video
                                        </button>
                                        <button onClick={() => { if(podcast) setActiveTab('podcast'); else generatePodcast(); }} style={{ flex: 1, padding: '20px', border: 'none', background: activeTab === 'podcast' ? 'white' : 'transparent', fontWeight: 800, color: activeTab === 'podcast' ? 'var(--primary)' : '#64748b', borderBottom: activeTab === 'podcast' ? '3px solid var(--primary)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <Headphones size={18} /> AI Podcast
                                        </button>
                                    </div>

                                    <div style={{ padding: '40px' }} ref={summaryRef}>
                                        {activeTab === 'summary' && (
                                            <div className="vibrant-summary animate-fade-in" style={{ color: '#0f172a', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                                
                                                {/* Action Bar */}
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '32px' }}>
                                                    <button onClick={toggleSpeech} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                                        {isReading ? <><VolumeX size={16}/> Stop</> : <><Volume2 size={16}/> Listen</>}
                                                    </button>
                                                    <button onClick={() => copyToClipboard(summaryData.raw)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                                        {copied ? <><Check size={16}/> Copied</> : <><Copy size={16}/> Copy All</>}
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            // Create a clean, formal print window
                                                            const printContent = summaryRef.current.cloneNode(true);
                                                            // Remove the action bar from the printable version
                                                            const actionBar = printContent.querySelector('.action-bar-no-print');
                                                            if (actionBar) actionBar.remove();
                                                            
                                                            const printWindow = window.open('', '_blank');
                                                            printWindow.document.write(`
                                                                <html>
                                                                    <head>
                                                                        <title>Takshila AI - Formal Video Summary</title>
                                                                        <style>
                                                                            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
                                                                            h1 { color: #ff5c00; font-size: 24px; border-bottom: 2px solid #ff5c00; padding-bottom: 10px; margin-bottom: 30px; }
                                                                            h2 { font-size: 18px; margin-top: 30px; color: #334155; }
                                                                            h3 { font-size: 16px; margin-top: 25px; color: #ff5c00; }
                                                                            p { line-height: 1.6; margin-bottom: 15px; }
                                                                            strong { color: #ff5c00; }
                                                                            ul { margin-bottom: 20px; line-height: 1.6; }
                                                                            li { margin-bottom: 8px; }
                                                                            .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                                                                        </style>
                                                                    </head>
                                                                    <body>
                                                                        <div style="text-align: right; color: #94a3b8; font-size: 12px; margin-bottom: 20px;">TAKSHILA AI WORKSPACE • ${new Date().toLocaleDateString()}</div>
                                                                        ${videoData ? `<h2>Source: ${videoData.title}</h2><p><strong>Channel:</strong> ${videoData.author}</p><hr style="border:0; border-top:1px solid #e2e8f0; margin: 20px 0;">` : ''}
                                                                        ${printContent.innerHTML}
                                                                        <div class="footer">Generated by Takshila AI. Highly accurate video intelligence report.</div>
                                                                    </body>
                                                                </html>
                                                            `);
                                                            printWindow.document.close();
                                                            printWindow.print();
                                                        }}
                                                        className="btn-secondary" 
                                                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                                    >
                                                        <Download size={16}/> Download PDF
                                                    </button>
                                                </div>

                                                <div style={{ background: 'linear-gradient(135deg, rgba(255,92,0,0.05) 0%, rgba(255,0,138,0.05) 100%)', padding: '24px', borderRadius: '16px', borderLeft: '4px solid var(--primary)', marginBottom: '32px' }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', marginTop: 0 }}>Quick Synopsis</h3>
                                                    <p style={{ margin: 0, fontWeight: 600 }}>{summaryData.quick.replace(/#/g, '').replace(/\*/g, '').replace(/-/g, '')}</p>
                                                </div>

                                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '20px' }}>Detailed Breakdown</h2>
                                                <p style={{ marginBottom: '32px' }}>{summaryData.detailed.replace(/#/g, '')}</p>

                                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '20px' }}>Chapters & Timestamps</h2>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                                                    {summaryData.timestamps.map((ts, i) => {
                                                        if(ts.trim() === '') return null;
                                                        return (
                                                            <li key={i} style={{ padding: '12px 16px', background: '#f8fafc', marginBottom: '8px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                                                                <Clock size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '4px' }}/>
                                                                <span>{ts.replace(/\*\*/g, '').replace(/-/g, '—')}</span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>

                                            </div>
                                        )}

                                        {activeTab === 'chat' && (
                                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
                                                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                                                    {chatHistory.length === 0 ? (
                                                        <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
                                                            <MessageCircle size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                                                            <p style={{ fontWeight: 600 }}>Ask anything about the video content.</p>
                                                            <p style={{ fontSize: '0.9rem' }}>"What were the main conclusions?"</p>
                                                        </div>
                                                    ) : (
                                                        chatHistory.map((msg, idx) => (
                                                            <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', background: msg.role === 'user' ? 'var(--primary)' : 'white', color: msg.role === 'user' ? 'white' : '#1e293b', padding: '16px 20px', borderRadius: '24px', borderBottomRightRadius: msg.role === 'user' ? '4px' : '24px', borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                                                                {msg.content}
                                                            </div>
                                                        ))
                                                    )}
                                                    {isChatLoading && (
                                                        <div style={{ alignSelf: 'flex-start', background: 'white', padding: '16px 20px', borderRadius: '24px', borderBottomLeftRadius: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                                                        </div>
                                                    )}
                                                    <div ref={chatEndRef} />
                                                </div>
                                                <form onSubmit={handleChat} style={{ display: 'flex', gap: '12px' }}>
                                                    <input type="text" className="form-input" style={{ flex: 1, borderRadius: '100px', height: '56px' }} placeholder="Ask a question..." value={chatInput} onChange={e => setChatInput(e.target.value)} disabled={isChatLoading} />
                                                    <button type="submit" className="btn-primary" style={{ height: '56px', borderRadius: '100px', padding: '0 32px' }} disabled={isChatLoading || !chatInput.trim()}>Ask</button>
                                                </form>
                                            </div>
                                        )}

                                        {activeTab === 'podcast' && (
                                            <div className="animate-fade-in" style={{ background: '#0f172a', padding: '40px', borderRadius: '24px', color: '#f1f5f9' }}>
                                                {/* Podcast Player UI (Same as original) */}
                                                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                                    <div onClick={toggleSpeech} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                        {isReading ? <Pause size={24} color="white" fill="white" /> : <Play size={24} color="white" fill="white" />}
                                                    </div>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>The Takshila Insider</h3>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>Featuring Fathima & Sam • AI Conversation</p>
                                                    </div>
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                                    <SkipBack size={20} style={{ cursor: 'pointer' }} />
                                                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', margin: '0 20px', borderRadius: '4px', position: 'relative', cursor: 'pointer' }}>
                                                        <div style={{ position: 'absolute', top: 0, left: 0, width: `${audioProgress}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                                                        <div style={{ position: 'absolute', top: '50%', left: `${audioProgress}%`, width: '12px', height: '12px', background: 'white', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
                                                    </div>
                                                    <SkipForward size={20} style={{ cursor: 'pointer' }} />
                                                </div>
                                                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '12px', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                    {podcast}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column: Key Points, Focus Areas, Quotes */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                
                                {/* Key Points Box */}
                                <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                                        <Sparkles size={18} color="var(--primary)" /> Top Insights
                                    </h3>
                                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569', fontSize: '0.95rem' }}>
                                        {summaryData.keyPoints.map((point, i) => {
                                            if(point.trim() === '' || point.includes('KEY_POINTS')) return null;
                                            return <li key={i}>{point.replace(/-/g, '').replace(/\*/g, '').trim()}</li>
                                        })}
                                    </ul>
                                </div>

                                {/* Takeaways Box */}
                                <div className="glass-card" style={{ padding: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
                                        <AlertTriangle size={18} color="#eab308" /> Actionable Takeaways
                                    </h3>
                                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569', fontSize: '0.95rem' }}>
                                        {summaryData.takeaways.map((point, i) => {
                                             if(point.trim() === '' || point.includes('ACTIONABLE_TAKEAWAYS')) return null;
                                             return <li key={i}>{point.replace(/-/g, '').replace(/\*/g, '').trim()}</li>
                                        })}
                                    </ul>
                                </div>

                                {/* Quotes Box */}
                                {summaryData.quotes && summaryData.quotes.length > 0 && (
                                    <div className="glass-card" style={{ padding: '24px', background: '#1e293b', color: 'white', border: 'none' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: '#94a3b8' }}>Notable Quotes</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                            {summaryData.quotes.map((quote, i) => {
                                                if(quote.trim() === '' || quote.includes('QUOTES')) return null;
                                                return (
                                                    <blockquote key={i} style={{ margin: 0, paddingLeft: '16px', borderLeft: '4px solid var(--primary)', fontStyle: 'italic', fontSize: '1.05rem', color: '#f8fafc' }}>
                                                        {quote.replace(/>/g, '').trim()}
                                                    </blockquote>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Keywords Tags */}
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: '#64748b', textTransform: 'uppercase' }}>Keywords</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {summaryData.keywords.map((kw, i) => {
                                            if(!kw) return null;
                                            return <span key={i} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{kw}</span>
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </>
            )}
            <style>{`
                .typing-dot {
                    width: 6px; height: 6px; background: #94a3b8; border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out both;
                }
                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default YoutubeSummarizerAdvanced;
