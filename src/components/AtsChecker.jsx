import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { generateResumeContent } from '../lib/openrouter';
import { CheckCircle2, AlertCircle, TrendingUp, Search, ShieldCheck, FileSearch, Loader, Zap } from 'lucide-react';
import { extractResumeText } from '../lib/pdfjs';

const AtsChecker = () => {
    const { resumeData } = useResume();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [pastedText, setPastedText] = useState('');
    const [analysisMode, setAnalysisMode] = useState('current'); // 'current' or 'pasted'
    const [extracting, setExtracting] = useState(false);

    const analyzeResume = async () => {
        setLoading(true);
        setError('');

        const resumeText = analysisMode === 'current'
            ? JSON.stringify({
                info: resumeData.personalInfo,
                summary: resumeData.summary,
                experience: resumeData.experience,
                education: resumeData.education,
                skills: resumeData.skills,
                projects: resumeData.projects
            })
            : pastedText;

        if (analysisMode === 'pasted' && !pastedText.trim()) {
            setError('Please upload a file or paste your resume text first.');
            setLoading(false);
            return;
        }

        const prompt = `Act as a high-end ATS (Applicant Tracking System) used by Fortune 500 companies. 
        Perform a brutal, honest analysis of the following resume. 
        Evaluate it based on:
        1. Impact: Are there quantified results (numbers, %, $)? 
        2. Readability: Is it concise or too wordy? 
        3. Keyword Density: Are industry-specific skills present?
        4. Formatting: Are there complex elements that might break parsing?

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
          "expert_advice": "string (one powerful piece of advice)"
        }

        Resume Content: ${resumeText}
        
        Response must be ONLY valid JSON and nothing else. No preamble.`;

        try {
            // Use gpt-4o-mini for significantly faster processing and lower latency instead of default 3.5 turbo or 4
            const response = await generateResumeContent(prompt, "You are a senior HR recruitment technologist at a top tech firm.", "openai/gpt-4o-mini");
            
            // Clean response to ensure it's valid JSON
            const jsonStr = response.replace(/```json|```/g, '').trim();
            const data = JSON.parse(jsonStr);
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Analysis failed. The AI might be busy. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setExtracting(true);
        setError('');

        try {
            const extractedText = await extractResumeText(file, { minLength: 20 });
            setPastedText(extractedText);
        } catch (err) {
            console.error('ATS upload failed:', err);
            setError(err.message || 'An error occurred while uploading. Please try again.');
        } finally {
            setExtracting(false);
            e.target.value = '';
        }
    };

    return (
        <div style={{ padding: '0 4px' }}>
            {/* Mode Switcher */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                background: 'rgba(255,255,255,0.05)',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)'
            }}>
                <button
                    onClick={() => { setAnalysisMode('current'); setResult(null); }}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: analysisMode === 'current' ? 'var(--primary)' : 'transparent',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Check Draft
                </button>
                <button
                    onClick={() => { setAnalysisMode('pasted'); setResult(null); }}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: analysisMode === 'pasted' ? 'var(--primary)' : 'transparent',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Upload & Check
                </button>
            </div>

            {!result && !loading ? (
                <div style={{ textAlign: 'center', padding: '32px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <FileSearch size={28} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                        {analysisMode === 'current' ? 'Analyze My Resume' : 'ATS Compatibility Scan'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {analysisMode === 'current'
                            ? 'Check the current resume you are building for compatibility.'
                            : 'Upload a text file or paste content to check your existing resume.'}
                    </p>

                    {analysisMode === 'pasted' && (
                        <div style={{ marginBottom: '24px' }}>
                            <label
                                htmlFor="file-upload"
                                style={{
                                    display: 'block',
                                    padding: '20px',
                                    border: '2px dashed var(--glass-border)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)',
                                    marginBottom: '12px',
                                    transition: 'all 0.2s',
                                    opacity: extracting ? 0.5 : 1,
                                    pointerEvents: extracting ? 'none' : 'auto'
                                }}
                                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                            >
                                <Search size={20} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {extracting ? 'Extracting text...' : 'Click to upload PDF, DOCX, or TXT'}
                                </span>
                                <input id="file-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>

                            <textarea
                                value={pastedText}
                                onChange={(e) => setPastedText(e.target.value)}
                                placeholder="...or paste resume text here"
                                className="form-input"
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: 'rgba(0,0,0,0.2)',
                                    resize: 'none',
                                    fontSize: '0.85rem'
                                }}
                            />
                        </div>
                    )}

                    <button onClick={analyzeResume} className="btn-primary" style={{ width: '100%', maxWidth: '250px' }} disabled={loading || extracting}>
                        <Zap size={18} /> {loading ? 'Scanning...' : 'Start AI Analysis'}
                    </button>
                    {error && <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.85rem' }}>{error}</p>}
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            border: '4px solid rgba(99, 102, 241, 0.1)',
                            borderRadius: '50%'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            border: '4px solid transparent',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1.2s linear infinite'
                        }}></div>
                        <Search size={30} color="var(--primary)" style={{ position: 'absolute', top: '25px', left: '25px' }} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Scanning Data...</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Evaluating your resume against ATS algorithms.</p>
                </div>
            ) : (
                <div className="animate-fade-in">
                    {/* Score Header & Breakdown */}
                    <div style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        marginBottom: '24px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Match Score
                                </span>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: getScoreColor(result.score), margin: '0' }}>
                                    {result.score}<span style={{ fontSize: '1.2rem', opacity: 0.6 }}>/100</span>
                                </h2>
                            </div>
                            <button
                                onClick={analyzeResume}
                                style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                            >
                                Fresh Scan
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            {[
                                { label: 'Impact', val: result.breakdown?.impact || 0 },
                                { label: 'Readability', val: result.breakdown?.readability || 0 },
                                { label: 'Keywords', val: result.breakdown?.keywords || 0 }
                            ].map(b => (
                                <div key={b.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>{b.label}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: getScoreColor(b.val) }}>{b.val}%</span>
                                    </div>
                                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${b.val}%`, background: getScoreColor(b.val), borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expert Advice Card */}
                    <div style={{ 
                        padding: '20px', 
                        borderRadius: '20px', 
                        background: 'linear-gradient(135deg, rgba(255, 92, 0, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', 
                        border: '1px solid rgba(255, 92, 0, 0.2)',
                        marginBottom: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                            <Zap size={80} />
                        </div>
                        <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Expert Advice</h4>
                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'white', lineHeight: 1.5 }}>
                            "{result.expert_advice}"
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        {/* Positive Points */}
                        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <h4 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                <CheckCircle2 size={18} /> High Impact Elements
                            </h4>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {result.high_impact_points.map((p, i) => (
                                    <li key={i} style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-primary)', opacity: 0.9 }}>{p}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Critical Fixes */}
                        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                            <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                <AlertCircle size={18} /> Critical Fixes Required
                            </h4>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {result.critical_fixes.map((p, i) => (
                                    <li key={i} style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-primary)', opacity: 0.9 }}>{p}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Keyword Suggetions */}
                        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                            <h4 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
                                <TrendingUp size={18} /> Recommended Keywords
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {result.keyword_suggestions.map((p, i) => (
                                    <span key={i} style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--primary)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        border: '1px solid rgba(99, 102, 241, 0.2)'
                                    }}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AtsChecker;
