import React, { useState } from 'react';
import { Mail, Sparkles, Layout, Download, FileText, Loader2, User, Building, Briefcase, Eye, Edit3, CheckCircle } from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';
import { useResume } from '../context/ResumeContext';
import LoadingMascot from '../components/common/LoadingMascot';

const CoverLetterPage = () => {
    const { resumeData } = useResume();
    const [jobDetails, setJobDetails] = useState({ role: '', company: '', description: '' });
    const [selectedTheme, setSelectedTheme] = useState('Professional');
    const [loading, setLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [mode, setMode] = useState('edit'); // 'preview' or 'edit'

    const themes = [
        'Professional', 'Modern', 'Creative', 'Minimal', 'Corporate', 
        'Technical', 'Startup', 'Formal', 'Executive', 'Academic'
    ];

    const handleGenerate = async () => {
        if (!jobDetails.role || !jobDetails.company) {
            alert('Please provide Job Role and Company name.');
            return;
        }

        setLoading(true);
        try {
            const prompt = `Generate a personalized cover letter based on the following details:
            
            Target Role: ${jobDetails.role}
            Company: ${jobDetails.company}
            Job Description (context): ${jobDetails.description}
            
            Candidate Info:
            Name: ${resumeData.personalInfo.fullName}
            Skills: ${resumeData.skills.map(s => s.name).join(', ')}
            Experience: ${resumeData.experience.map(e => `${e.role} at ${e.company}`).join(', ')}
            
            Theme Style: ${selectedTheme}
            
            The letter should be professional, compelling, and tailored to the theme. 
            Do NOT include placeholders like [Your Name] if the information is provided.
            Provide the direct text of the letter.`;

            const response = await generateResumeContent(prompt, "You are an expert career consultant specialized in writing winning cover letters.");
            setCoverLetter(response);
            setMode('preview');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        window.print();
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
                    <Mail size={16} />
                    Career Communications
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    AI <span className="gradient-text">Cover Letter Generator</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Generate high-converting, personalized cover letters tailored to your dream role.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', alignItems: 'start' }}>
                {/* Left: Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Layout size={18} color="var(--primary)" /> Job Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 600 }}>Job Role</label>
                                <div className="input-wrapper">
                                    <Briefcase size={18} className="input-icon" />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={jobDetails.role}
                                        onChange={(e) => setJobDetails({...jobDetails, role: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 600 }}>Company Name</label>
                                <div className="input-wrapper">
                                    <Building size={18} className="input-icon" />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="e.g. Google"
                                        value={jobDetails.company}
                                        onChange={(e) => setJobDetails({...jobDetails, company: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 600 }}>Job Description (Optional)</label>
                                <textarea 
                                    className="form-input" 
                                    style={{ height: '120px', resize: 'none' }}
                                    placeholder="Paste job description here for better AI analysis..."
                                    value={jobDetails.description}
                                    onChange={(e) => setJobDetails({...jobDetails, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkles size={18} color="var(--accent)" /> Select Theme
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {themes.map(theme => (
                                <button 
                                    key={theme}
                                    onClick={() => setSelectedTheme(theme)}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: selectedTheme === theme ? 'var(--primary)' : '#e2e8f0',
                                        background: selectedTheme === theme ? 'rgba(255, 92, 0, 0.05)' : 'white',
                                        color: selectedTheme === theme ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: '0.2s'
                                    }}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', height: '56px', borderRadius: '16px' }}
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : (
                            <>Generate Cover Letter <Sparkles size={18} /></>
                        )}
                    </button>
                </div>

                {/* Right: Output */}
                <div style={{ height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none' }}>
                            <LoadingMascot message="Crafting your personalized cover letter..." />
                        </div>
                    ) : coverLetter ? (
                        <div className="glass-card" style={{ flex: 1, padding: '32px', background: 'white', border: 'none', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '100px', padding: '4px' }}>
                                    <button 
                                        onClick={() => setMode('preview')}
                                        style={{ 
                                            padding: '8px 20px', borderRadius: '100px', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                            background: mode === 'preview' ? 'white' : 'transparent',
                                            color: mode === 'preview' ? 'var(--primary)' : 'var(--text-secondary)',
                                            boxShadow: mode === 'preview' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                        }}
                                    >
                                        <Eye size={16} style={{ marginRight: '6px' }} /> Preview
                                    </button>
                                    <button 
                                        onClick={() => setMode('edit')}
                                        style={{ 
                                            padding: '8px 20px', borderRadius: '100px', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                            background: mode === 'edit' ? 'white' : 'transparent',
                                            color: mode === 'edit' ? 'var(--primary)' : 'var(--text-secondary)',
                                            boxShadow: mode === 'edit' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                        }}
                                    >
                                        <Edit3 size={16} style={{ marginRight: '6px' }} /> Edit
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleExportPDF}>
                                        <Download size={16} /> Export
                                    </button>
                                </div>
                            </div>

                            {mode === 'preview' ? (
                                <div className="no-print" style={{ 
                                    padding: '40px', 
                                    background: '#fff', 
                                    border: '1px solid #f1f5f9', 
                                    borderRadius: '16px',
                                    lineHeight: 1.8,
                                    fontSize: '1rem',
                                    color: '#334155',
                                    whiteSpace: 'pre-wrap',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                    flex: 1
                                }}>
                                    {coverLetter}
                                </div>
                            ) : (
                                <textarea 
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        flex: 1, 
                                        padding: '40px', 
                                        background: '#fff', 
                                        border: '1px solid #f1f5f9', 
                                        borderRadius: '16px',
                                        lineHeight: 1.8,
                                        fontSize: '1rem',
                                        color: '#334155',
                                        resize: 'none',
                                        outline: 'none'
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', background: 'white', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255, 92, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '24px' }}>
                                <FileText size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Your AI Letter Awaits</h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>
                                Fill in the job details on the left and select a theme to generate a tailored cover letter.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media print {
                    header, .no-print, nav, aside { display: none !important; }
                    .main-content { padding: 0 !important; }
                    .scroll-container { overflow: visible !important; }
                    .glass-card { box-shadow: none !important; border: none !important; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
};

export default CoverLetterPage;
