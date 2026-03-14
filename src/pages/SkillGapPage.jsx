import React, { useState } from 'react';
import { LineChart, Target, Zap, AlertCircle, BrainCircuit, BookOpen } from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';
import { useResume } from '../context/ResumeContext';
import LoadingMascot from '../components/common/LoadingMascot';

const SkillGapPage = () => {
    const { resumeData } = useResume();
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleAnalyze = async () => {
        if (!targetRole) return;
        setLoading(true);
        setAnalysis(null);
        try {
            const prompt = `Perform a skill gap analysis for the following:
            Target Role: ${targetRole}
            Current Skills: ${resumeData.skills.map(s => s.name).join(', ')}
            Current Title: ${resumeData.personalInfo.title}
            
            Identify:
            1. Core Skills Match (%)
            2. Missing Technical Skills
            3. Missing Soft Skills
            4. Recommended Learning Path (Specific certifications or topics)
            
            Response format:
            Match: [number]%
            Missing Technical: [list]
            Missing Soft: [list]
            Path: [list]`;

            const response = await generateResumeContent(prompt, "You are a specialized career growth coach.");
            
            const match = response.match(/Match:\s*(\d+)%/i)?.[1] || '0';
            const tech = response.match(/Missing Technical:\s*([\s\S]*?)(?=Missing Soft:|$)/i)?.[1].trim().split('\n').filter(l => l.trim()) || [];
            const soft = response.match(/Missing Soft:\s*([\s\S]*?)(?=Path:|$)/i)?.[1].trim().split('\n').filter(l => l.trim()) || [];
            const path = response.match(/Path:\s*([\s\S]*)/i)?.[1].trim().split('\n').filter(l => l.trim()) || [];

            setAnalysis({ match, tech, soft, path });
        } catch (error) {
            console.error(error);
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
                    <LineChart size={16} />
                    Career Growth Engine
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    AI <span className="gradient-text">Skill Gap Analyzer</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Bridge the gap between your current profile and your dream career role.
                </p>
            </header>

            <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none' }}>
                {loading ? (
                    <LoadingMascot message="Calculating your career trajectory..." />
                ) : (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: 800 }}>What's your dream role?</label>
                            <div style={{ position: 'relative' }}>
                                <Target size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ paddingLeft: '56px', height: '64px', borderRadius: '100px' }}
                                    placeholder="e.g. Principal Product Manager at a Fintech Startup"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                />
                            </div>
                        </div>
                        <button 
                            className="btn-primary" 
                            style={{ height: '64px', padding: '0 40px', borderRadius: '100px' }}
                            onClick={handleAnalyze}
                            disabled={!targetRole}
                        >
                            Analyze Skills <BrainCircuit size={18} />
                        </button>
                    </div>
                )}
            </div>

            {analysis && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="animate-fade-in-up">
                    <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px' }}>{analysis.match}%</div>
                        <div style={{ fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '24px' }}>Skills Match</div>
                        <div style={{ height: '12px', width: '100%', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ width: `${analysis.match}%`, height: '100%', background: 'var(--primary)', transition: 'width 1s ease-out' }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Zap size={18} color="var(--primary)" /> Technical Gaps
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {analysis.tech.map((s, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                                            <AlertCircle size={14} color="#ef4444" /> {s.replace(/^[*-]\s*/, '')}
                                        </div>
                                    ))}
                                    {analysis.tech.length === 0 && <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No major technical gaps found.</p>}
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Target size={18} color="#6366f1" /> Soft Skill Gaps
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {analysis.soft.map((s, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                                            <AlertCircle size={14} color="#f59e0b" /> {s.replace(/^[*-]\s*/, '')}
                                        </div>
                                    ))}
                                    {analysis.soft.length === 0 && <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No major soft skill gaps found.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BookOpen size={24} color="#10b981" /> Recommended Learning Path
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {analysis.path.map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>
                                            {i + 1}
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#334155' }}>{step.replace(/^[*\d-]\s*/, '')}</span>
                                    </div>
                                ))}
                                {analysis.path.length === 0 && <p style={{ color: '#94a3b8' }}>You are already on the right track!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillGapPage;
