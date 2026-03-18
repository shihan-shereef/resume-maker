import React, { useState, useRef } from 'react';
import { Target, FileUp, ArrowRight, MessageSquare, Zap, AlertTriangle, Eye } from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';
import LoadingMascot from '../components/common/LoadingMascot';
import { extractResumeText } from '../lib/pdfjs';

const AtsCheckerPage = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleAnalyze = async (uploadedFile) => {
        if (!uploadedFile) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const text = await extractResumeText(uploadedFile, { allowTxt: false, minLength: 50 });
            if (!text || text.trim().length < 50) {
                throw new Error("The resume file seems empty or contains too little text for analysis.");
            }
            
            const prompt = `Act as a high-end ATS (Applicant Tracking System) used by Fortune 500 companies. 
Perform a brutal, honest analysis of the following resume. 
Evaluate it based on:
1. Impact: Quantified results (numbers, %, $)? 
2. Readability: Concise or wordy? 
3. Keyword Density: Industry-specific skills present?
4. Formatting: Complex elements that might break parsing?

Format your response as a JSON object with these EXACT fields:
{
  "score": number (0-100),
  "breakdown": {
    "impact": number (0-100),
    "readability": number (0-100),
    "keywords": number (0-100)
  },
  "high_impact_points": ["string", ...],
  "critical_fixes": ["string", ...],
  "keyword_suggestions": ["string", ...],
  "formatting_verdict": "string (concise verdict)",
  "expert_advice": "string (one powerful piece of advice)",
  "highlight_phrases": ["string", ...]
}

Resume Content:
${text.substring(0, 8000)}

Response must be ONLY valid JSON and nothing else. No preamble.`;

            const response = await generateResumeContent(prompt, "You are a senior HR recruitment technologist.", "openai/gpt-4o-mini");
            const data = JSON.parse(response.replace(/```json|```/g, '').trim());

            // Dynamically mark the original text using highlight_phrases from AI
            let processedText = text;
            (data.highlight_phrases || []).forEach(str => {
                if (str.length > 5) {
                    const regex = new RegExp(`(${str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                    processedText = processedText.replace(regex, '<mark class="ats-weak">$1</mark>');
                }
            });
            
            setResult({
                ...data,
                highlightedText: processedText,
                fileName: uploadedFile.name
            });
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || "An unexpected error occurred during analysis.");
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 5vw, 32px)', padding: 'min(20px, 3%)' }} className="animate-fade-in">
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
                <h1 className="responsive-title">
                    Takshila <span className="gradient-text">ATS Resume Checker</span>
                </h1>
                <p className="responsive-subtitle">
                    Upload your resume and let our AI analyze its compatibility with modern Applicant Tracking Systems.
                </p>
            </header>

            {!result ? (
                <div 
                    className="glass-card" 
                    style={{ 
                        padding: 'min(100px, 15%) min(40px, 10%)', 
                        background: 'white', 
                        border: '2px dashed #e2e8f0', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '24px',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                    onClick={() => !loading && fileInputRef.current.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleAnalyze(e.target.files[0])} 
                        style={{ display: 'none' }} 
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
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
                <div className="ats-result-layout" style={{ 
                    display: 'grid', 
                    gap: '32px' 
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Score Card */}
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
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                                {[
                                    { label: 'Impact', val: result.breakdown.impact },
                                    { label: 'Readability', val: result.breakdown.readability },
                                    { label: 'Keywords', val: result.breakdown.keywords }
                                ].map(b => (
                                    <div key={b.label}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>{b.label}</div>
                                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${b.val}%`, background: 'var(--primary)', borderRadius: '3px' }}></div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '6px' }}>{b.val}%</div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-secondary" onClick={() => setResult(null)} style={{ width: '100%' }}>
                                <FileUp size={16} /> Re-scan Different Resume
                            </button>
                        </div>

                        {/* Expert Advice */}
                        <div style={{ 
                            padding: '32px', 
                            borderRadius: '24px', 
                            background: 'var(--text-primary)', 
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                                <Zap size={100} />
                            </div>
                            <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Honest Expert Advice</h4>
                            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, lineHeight: '1.6' }}>
                                "{result.expert_advice}"
                            </p>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Eye size={24} color="var(--primary)" /> Smart Audit Preview
                            </h4>
                            <div style={{ 
                                background: '#f8fafc', 
                                padding: '32px', 
                                borderRadius: '20px', 
                                border: '1px solid #e2e8f0', 
                                maxHeight: '400px', 
                                overflowY: 'auto' 
                            }}>
                                <div style={{ fontWeight: 800, marginBottom: '16px', color: '#64748b' }}>{result.fileName}</div>
                                <div 
                                    className="resume-preview-content"
                                    style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-wrap' }}
                                    dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1rem', fontWeight: 800 }}>High Impact Points</h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {result.high_impact_points.map((p, i) => (
                                        <li key={i} style={{ fontSize: '0.95rem', color: '#334155' }}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1rem', fontWeight: 800 }}>Critical Fixes</h4>
                                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {result.critical_fixes.map((p, i) => (
                                        <li key={i} style={{ fontSize: '0.95rem', color: '#334155' }}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                         <div style={{ padding: '32px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                            <h4 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1rem', fontWeight: 800 }}>Recommended Keywords</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {result.keyword_suggestions.map((p, i) => (
                                    <span key={i} style={{ padding: '6px 14px', borderRadius: '100px', background: 'white', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 700 }}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtsCheckerPage;
