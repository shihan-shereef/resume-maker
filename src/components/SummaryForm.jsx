import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { generateResumeContent } from '../lib/openrouter';
import { Sparkles, Loader } from 'lucide-react';

const SummaryForm = () => {
    const { resumeData, updateSummary } = useResume();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateAI = async () => {
        setLoading(true);
        setError('');
        const { jobTitle, skills } = resumeData.personalInfo;
        const skillsList = resumeData.skills.map(s => s.name).join(', ');

        const prompt = `Write a professional resume summary for a ${jobTitle || 'professional'}. 
    Key skills: ${skillsList || 'various professional skills'}. 
    Keep it concise, impactful, and under 4 sentences. Make it engaging. Do not include quotes.`;

        try {
            const generated = await generateResumeContent(prompt);
            updateSummary(generated.trim());
        } catch (err) {
            setError('AI Generation Failed. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 480 ? 'flex-start' : 'center', gap: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
                    Write a professional summary or let our AI generate one.
                </p>
                <button
                    onClick={handleGenerateAI}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--primary)',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        opacity: loading ? 0.7 : 1,
                        width: window.innerWidth < 480 ? '100%' : 'auto',
                        justifyContent: 'center'
                    }}
                >
                    {loading ? <Loader size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} color="var(--primary)" />}
                    {loading ? 'Generating...' : 'Enhance with AI'}
                </button>
            </div>

            {error && <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</div>}

            <textarea
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                className="form-input"
                placeholder="e.g. Passionate software engineer with 5+ years of experience..."
                style={{ padding: '14px', minHeight: '150px', resize: 'vertical' }}
            />
            <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default SummaryForm;
