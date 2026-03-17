import React, { useState } from 'react';
import { Briefcase, Calendar, CheckSquare, Target, Loader2, PlayCircle, BookOpen, ChevronRight } from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';

const RoadmapGenerator = () => {
    const [careerGoal, setCareerGoal] = useState('');
    const [timeframe, setTimeframe] = useState('3 months');
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!careerGoal) return;
        
        setLoading(true);
        try {
            const prompt = `Create a structured learning roadmap for someone who wants to become a ${careerGoal} in ${timeframe}.
            Provide weekly learning steps, recommended tools, and key projects to build.
            
            Format the response in JSON:
            {
                "career": "Career Title",
                "weeks": [
                    { "week": 1, "topic": "Topic Name", "tasks": ["Task 1", "Task 2"], "resources": ["Resource 1"] },
                    ... (provide 4 weeks as example)
                ],
                "projects": [
                    { "title": "Project Name", "description": "Short description" }
                ],
                "tools": ["Tool 1", "Tool 2"]
            }`;

            const response = await generateResumeContent(prompt, "You are a Senior Career Coach and Technical Architect.", "openai/gpt-4o-mini");
            
            let jsonStr = response;
            if (response.includes('```json')) {
                jsonStr = response.split('```json')[1].split('```')[0].trim();
            } else if (response.includes('```')) {
                jsonStr = response.split('```')[1].split('```')[0].trim();
            }
            
            const data = JSON.parse(jsonStr);
            setRoadmap(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                    AI <span className="gradient-text">Roadmap Generator</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Get a personalized learning path to achieve your career goals.
                </p>
            </header>

            <div className="glass-card">
                <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">I want to become a...</label>
                        <div className="input-wrapper">
                            <Target size={18} className="input-icon" />
                            <input 
                                type="text" 
                                placeholder="e.g. Senior Frontend Engineer" 
                                value={careerGoal}
                                onChange={(e) => setCareerGoal(e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Within...</label>
                        <select 
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '16px' }}
                        >
                            <option>1 month</option>
                            <option>3 months</option>
                            <option>6 months</option>
                            <option>1 year</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '52px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate Roadmap'}
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '24px' }}>
                        <Loader2 size={48} color="var(--primary)" />
                    </div>
                    <h2>Architecting your path...</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Analyzing market requirements and structuring your learning phases.</p>
                </div>
            ) : roadmap ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {roadmap.weeks.map((week, i) => (
                                <div key={i} className="glass-card" style={{ display: 'flex', gap: '24px' }}>
                                    <div style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        borderRadius: '16px', 
                                        background: 'var(--primary)', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'white'
                                    }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8 }}>WEEK</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{week.week}</span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{week.topic}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {week.tasks.map((task, j) => (
                                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    <CheckSquare size={14} color="var(--primary)" />
                                                    <span>{task}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="glass-card">
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <PlayCircle size={18} color="var(--accent)" /> Projects to Build
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {roadmap.projects.map((project, i) => (
                                        <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{project.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{project.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card">
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BookOpen size={18} color="var(--primary)" /> Core Tech Stack
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {roadmap.tools.map((tool, i) => (
                                        <span key={i} style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--glass-bg)', fontSize: '0.8rem', border: '1px solid var(--glass-border)' }}>
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default RoadmapGenerator;
