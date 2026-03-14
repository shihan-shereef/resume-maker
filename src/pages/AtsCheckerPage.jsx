import React, { useState, useRef } from 'react';
import { Target, FileUp, ArrowRight, MessageSquare, Zap, AlertTriangle, Eye } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { generateResumeContent } from '../lib/openrouter';
import LoadingMascot from '../components/common/LoadingMascot';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const AtsCheckerPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const extractText = async (file) => {
        try {
            const fileType = file.name.split('.').pop().toLowerCase();
            if (fileType === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                
                // Parallelize for speed
                const pagePromises = Array.from({ length: pdf.numPages }, (_, i) => 
                    pdf.getPage(i + 1).then(async (page) => {
                        const textContent = await page.getTextContent();
                        return textContent.items.map(item => item.str).join(' ');
                    })
                );
                
                const pageTexts = await Promise.all(pagePromises);
                return pageTexts.join('\n');
            } else if (fileType === 'docx') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                return result.value;
            }
            throw new Error('Unsupported file format. Please upload PDF or DOCX.');
        } catch (err) {
            console.error('Extraction error:', err);
            throw new Error(`Could not read file: ${err.message}`);
        }
    };

    const handleAnalyze = async (uploadedFile) => {
        if (!uploadedFile) return;
        setFile(uploadedFile);
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const text = await extractText(uploadedFile);
            if (!text || text.trim().length < 50) {
                throw new Error("The resume file seems empty or contains too little text for analysis.");
            }
            
            const prompt = `Perform a comprehensive ATS (Applicant Tracking System) check on the following resume text.
            
            Resume Text:
            ${text.substring(0, 8000)}
            
            Output strictly in the following JSON-like format:
            SCORE: [number]
            KEYWORDS: [comma separated list of missing keywords]
            GAPS: [comma separated list of skill gaps]
            FORMATTING: [comma separated list of layout issues]
            SUGGESTIONS: [list of actionable feedback]
            HIGHLIGHTS: [List 3-5 specific short sentences or phrases from the resume that are weak or lack metrics, separated by " | "]
            
            Be critical and professional. Target a 100% compatibility score in your suggestions.`;

            // Using "openai/gpt-4o-mini" which is very fast
            const response = await generateResumeContent(prompt, "You are a senior HR recruitment technologist.", "openai/gpt-4o-mini");
            
            // Robust Parsing
            const score = parseInt(response.match(/SCORE:\s*(\d+)/)?.[1] || "0");
            const keywords = response.match(/KEYWORDS:\s*(.*)/)?.[1] || "None found";
            const gaps = response.match(/GAPS:\s*(.*)/)?.[1] || "None found";
            const formatting = response.match(/FORMATTING:\s*(.*)/)?.[1] || "None found";
            const suggestions = response.match(/SUGGESTIONS:\s*([\s\S]*?)(?=HIGHLIGHTS:|$)/)?.[1] || "No specific suggestions.";
            const highlightStrings = (response.match(/HIGHLIGHTS:\s*(.*)/)?.[1] || "").split('|').map(s => s.trim()).filter(Boolean);

            // Dynamically mark the original text
            let processedText = text;
            highlightStrings.forEach(str => {
                if (str.length > 5) { // Avoid masking tiny punctuation or single words
                    const regex = new RegExp(`(${str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    processedText = processedText.replace(regex, '<mark class="ats-weak">$1</mark>');
                }
            });
            
            setResult({
                score,
                keywords,
                gaps,
                formatting,
                suggestions,
                highlightedText: processedText,
                fileName: uploadedFile.name
            });
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || "An unexpected error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    letterSpacing: '0.1em'
                }}>
                    <Target size={16} />
                    ATS Optimization
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Takshila <span className="gradient-text">ATS Resume Checker</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Upload your resume and let our AI analyze its compatibility with modern Applicant Tracking Systems.
                </p>
            </header>

            {!result ? (
                <div 
                    className="glass-card" 
                    style={{ 
                        padding: '100px 40px', 
                        background: 'white', 
                        border: '2px dashed #e2e8f0', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '24px',
                        cursor: 'pointer'
                    }}
                    onClick={() => !loading && fileInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleAnalyze(e.target.files[0])} 
                        style={{ display: 'none' }} 
                        accept=".pdf,.docx" 
                    />
                    
                    {loading ? (
                        <LoadingMascot message="Analyzing your resume patterns..." />
                    ) : (
                        <>
                            <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: 'rgba(255, 92, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <FileUp size={60} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Upload Resume</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Support for AI-ready PDF and DOCX files</p>
                            </div>
                            {error && (
                                <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {error}
                                </div>
                            )}
                            <button className="btn-primary" style={{ height: '56px', padding: '0 48px', borderRadius: '100px' }}>
                                Select File <ArrowRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                    {/* Score Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' }}>
                                <svg width="180" height="180" viewBox="0 0 180 180">
                                    <circle cx="90" cy="90" r="80" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                    <circle 
                                        cx="90" cy="90" r="80" 
                                        fill="none" 
                                        stroke="var(--primary)" 
                                        strokeWidth="12" 
                                        strokeDasharray={`${result.score * 5.02} 502`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 90 90)"
                                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                    />
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)' }}>{result.score}%</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>ATS Match</div>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                                {result.score >= 80 ? 'Excellent Match!' : result.score >= 60 ? 'Good Potential' : 'Needs Improvement'}
                            </h3>
                            <button className="btn-secondary" onClick={() => setResult(null)} style={{ width: '100%', marginTop: '20px' }}>
                                <FileUp size={16} /> Re-scan Resume
                            </button>
                        </div>

                        <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Eye size={18} color="var(--primary)" /> Smart Highlight Preview
                            </h4>
                            <div style={{ 
                                background: '#f8fafc', 
                                padding: '24px', 
                                borderRadius: '16px', 
                                border: '1px solid #e2e8f0', 
                                maxHeight: '500px', 
                                overflowY: 'auto' 
                            }}>
                                <div style={{ fontWeight: 800, marginBottom: '12px', color: 'var(--text-secondary)' }}>{result.fileName}</div>
                                <div 
                                    className="resume-preview-content"
                                    style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#475569', whiteSpace: 'pre-wrap' }}
                                    dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                                />
                                <div style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, background: 'rgba(255, 92, 0, 0.05)', padding: '12px', borderRadius: '8px' }}>
                                    <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                    Highlighted sections above indicate low-impact language or missing data.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="glass-card" style={{ padding: '48px', background: 'white', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255, 92, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <MessageSquare size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AI Performance Report</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { title: 'Missing Keywords', icon: Target, color: '#f59e0b', content: result.keywords },
                                { title: 'Skill Gaps', icon: Zap, color: '#10b981', content: result.gaps },
                                { title: 'Formatting Issues', icon: AlertTriangle, color: '#ef4444', content: result.formatting }
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <item.icon size={20} color={item.color} />
                                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.title}</h4>
                                    </div>
                                    <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '1rem' }}>{item.content}</p>
                                </div>
                            ))}

                            <div style={{ marginTop: '12px' }}>
                                <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Actionable Suggestions</h4>
                                <div style={{ 
                                    padding: '32px', 
                                    borderRadius: '20px', 
                                    background: 'var(--text-primary)', 
                                    color: 'white',
                                    lineHeight: '1.8'
                                }}>
                                    {result.suggestions}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtsCheckerPage;
