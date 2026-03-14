import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { generateResumeContent } from '../lib/openrouter';
import { CheckCircle2, AlertCircle, TrendingUp, Search, ShieldCheck, FileSearch, Loader, Zap } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// PDF Worker configuration - version must match package.json exactly
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.5.207/pdf.worker.min.mjs`;

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

        const prompt = `Act as an expert ATS (Applicant Tracking System) Specialist. Analyze the following resume text or data and provide a detailed ATS compatibility score.
        
        Format your response as a JSON object with these fields:
        1. score: (number 0-100)
        2. high_impact_points: (array of strings, positive things)
        3. critical_fixes: (array of strings, things that will get it filtered out)
        4. keyword_suggestions: (array of strings, missing industry keywords)
        5. formatting_verdict: (string, short comment on layout)

        Resume Content: ${resumeText}
        
        Response must be ONLY valid JSON.`;

        try {
            // Use gpt-4o-mini for significantly faster processing and lower latency instead of default 3.5 turbo or 4
            const response = await generateResumeContent(prompt, "You are a senior HR recruitment technologist.", "openai/gpt-4o-mini");
            
            // Clean response to ensure it's valid JSON
            const jsonStr = response.replace(/```json|```/g, '').trim();
            const data = JSON.parse(jsonStr);
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Analysis failed. Please try again.');
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
            if (file.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPastedText(e.target.result);
                    setExtracting(false);
                };
                reader.readAsText(file);
            }
            else if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        console.log("PDF loading started...");
                        const typedarray = new Uint8Array(e.target.result);
                        const loadingTask = pdfjsLib.getDocument({
                            data: typedarray,
                            useWorkerFetch: true,
                            isEvalSupported: false,
                        });

                        const pdf = await loadingTask.promise;
                        let fullText = '';
                        console.log(`PDF loaded. Number of pages: ${pdf.numPages}`);

                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            fullText += pageText + '\n';
                        }

                        if (!fullText.trim()) {
                            throw new Error("Extracted text is empty. The PDF might be an image/scan.");
                        }

                        setPastedText(fullText.trim());
                        setExtracting(false);
                    } catch (err) {
                        console.error("PDF Parsing Error:", err);
                        setError(`Failed to parse PDF: ${err.message || 'Unknown error'}. Try copying and pasting the text instead.`);
                        setExtracting(false);
                    }
                };
                reader.readAsArrayBuffer(file);
            }
            else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const arrayBuffer = e.target.result;
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        setPastedText(result.value);
                        setExtracting(false);
                    } catch (err) {
                        setError('Failed to parse Word file. Try copying and pasting the text instead.');
                        setExtracting(false);
                    }
                };
                reader.readAsArrayBuffer(file);
            }
            else {
                setError('Unsupported file format. Please use PDF, DOCX, or TXT.');
                setExtracting(false);
            }
        } catch (err) {
            setError('An error occurred while uploading. Please try again.');
            setExtracting(false);
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
                    {/* Score Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '24px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        marginBottom: '24px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Overall ATS Score
                            </span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: getScoreColor(result.score), margin: '4px 0' }}>
                                {result.score}<span style={{ fontSize: '1.2rem', opacity: 0.7 }}>/100</span>
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={16} color={getScoreColor(result.score)} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{result.formatting_verdict}</span>
                            </div>
                        </div>
                        <button
                            onClick={analyzeResume}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                        >
                            Re-Scan App
                        </button>
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
