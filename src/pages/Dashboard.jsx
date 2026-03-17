import React from 'react';
import { 
    FileText, 
    Briefcase, 
    CheckCircle, 
    Clock, 
    TrendingUp, 
    Plus,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Resume Strength', value: '92%', icon: TrendingUp, color: '#10b981' },
        { label: 'Saved Jobs', value: '18', icon: Briefcase, color: 'var(--primary)' },
        { label: 'AI Summaries', value: '45', icon: Sparkles, color: '#ff008a' },
        { label: 'Active Tasks', value: '6', icon: CheckCircle, color: '#f59e0b' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="animate-fade-in">
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
                    <Sparkles size={16} />
                    Career Workspace
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Welcome to <span className="gradient-text">Takshila</span> AI
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}>
                    Manage your professional growth with intelligent AI tools.
                </p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: 'white', border: 'none' }}>
                        <div style={{ 
                            width: '56px', 
                            height: '56px', 
                            borderRadius: '16px', 
                            background: stat.color === 'var(--primary)' ? 'rgba(255, 92, 0, 0.05)' : `${stat.color}08`, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: stat.color
                        }}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
                gap: '32px' 
            }}>
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recommended Jobs</h2>
                        <button onClick={() => navigate('/job-search')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>View Market</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { title: 'Senior Product Designer', company: 'GlobalTech', match: '98%' },
                            { title: 'AI Solutions Architect', company: 'InnovaSoft', match: '94%' },
                            { title: 'Frontend Lead', company: 'DesignCo', match: '91%' }
                        ].map((job, i) => (
                            <div key={i} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '20px', 
                                padding: '20px', 
                                borderRadius: 'var(--radius-md)', 
                                border: '1px solid #f1f5f9',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            >
                                <div style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    borderRadius: '50%', 
                                    background: 'var(--primary)' 
                                }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{job.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{job.company}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>{job.match} Match</div>
                                </div>
                                <ArrowRight size={18} color="#cbd5e1" />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px', background: 'var(--text-primary)', color: 'white' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>AI Career Coach</h2>
                        <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '32px' }}>
                            "Your resume score has increased by 15% this week. Improving your 'Project Descriptions' could boost it further."
                        </p>
                        <button className="btn-primary" style={{ width: '100%', borderRadius: '12px', height: '52px' }}>
                            <Sparkles size={18} /> Improve Resume
                        </button>
                    </div>

                    <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>Quick Tools</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <button onClick={() => navigate('/notes')} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                                <Plus size={20} color="var(--primary)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>New AI Note</span>
                            </button>
                            <button onClick={() => navigate('/resume')} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                                <FileText size={20} color="var(--primary)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Create Resume</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
