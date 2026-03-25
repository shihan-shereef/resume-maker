import React, { useState } from 'react';
import { Github, Code, AlertTriangle, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeInput = ({ onGithubSubmit, onManualSubmit, error }) => {
    const [mode, setMode] = useState('github'); // 'github' or 'manual'
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');

    const handleGithubSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) onGithubSubmit(url);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (code.trim()) onManualSubmit(code, language);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none' }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                    <button 
                        onClick={() => setMode('github')}
                        style={{ 
                            background: 'none', border: 'none', padding: '12px 24px', borderRadius: '12px',
                            fontWeight: 800, cursor: 'pointer', transition: '0.3s',
                            color: mode === 'github' ? 'var(--primary)' : '#64748b',
                            background: mode === 'github' ? 'rgba(255, 92, 0, 0.05)' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <Github size={18} /> From GitHub URL
                    </button>
                    <button 
                        onClick={() => setMode('manual')}
                        style={{ 
                            background: 'none', border: 'none', padding: '12px 24px', borderRadius: '12px',
                            fontWeight: 800, cursor: 'pointer', transition: '0.3s',
                            color: mode === 'manual' ? 'var(--primary)' : '#64748b',
                            background: mode === 'manual' ? 'rgba(255, 92, 0, 0.05)' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <Code size={18} /> Paste Manually
                    </button>
                </div>

                {mode === 'github' ? (
                    <form onSubmit={handleGithubSubmit} className="animate-fade-in">
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Public Repository URL</label>
                            <div style={{ position: 'relative' }}>
                                <Github size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ paddingLeft: '56px', height: '64px', borderRadius: '100px', fontSize: '1rem' }}
                                    placeholder="https://github.com/owner/repository"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                                We'll recursively fetch all code files from the primary branch.
                            </p>
                        </div>
                        <button className="btn-primary" style={{ height: '64px', borderRadius: '100px', width: '100%', fontSize: '1.1rem', marginTop: '24px' }}>
                            Analyze Repository <Sparkles size={20} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleManualSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Language</label>
                            <select 
                                className="form-input" 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                                style={{ height: '56px', borderRadius: '12px' }}
                            >
                                <option value="javascript">JavaScript / React</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="c++">C++ / C</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Source Code</label>
                            <textarea 
                                className="form-input" 
                                style={{ minHeight: '300px', borderRadius: '16px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', padding: '20px', lineHeight: '1.6' }}
                                placeholder="Paste your code here for analysis..."
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-primary" style={{ height: '64px', borderRadius: '100px', width: '100%', fontSize: '1.1rem' }}>
                            Analyze Snippet <Sparkles size={20} />
                        </button>
                    </form>
                )}

                {error && (
                    <div style={{ marginTop: '24px', padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={18} /> {error}
                    </div>
                )}
            </div>

            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={18} color="var(--primary)" /> How it works
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#64748b', margin: 0, paddingLeft: '20px' }}>
                    <li>AI parses your code structure and identifies logical patterns.</li>
                    <li>We cross-reference against common security vulnerabilities (OWASP).</li>
                    <li>Performance analysis checks for unnecessary re-renders, loops, and memory leaks.</li>
                    <li>Clean-code metrics evaluate readability and maintainability.</li>
                </ul>
            </div>
            
            <style>{`
                .info-icon { opacity: 0.6; }
                @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

// Internal Info icon replacement
const Info = ({ size, color, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export default CodeInput;
