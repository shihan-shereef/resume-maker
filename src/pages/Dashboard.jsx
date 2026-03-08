import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import Preview from '../components/Preview';
import { LogOut, Save, Download } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const { resumeData } = useResume();
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email);
            } else {
                navigate('/login');
            }
        };
        getUser();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-dark)' }}>
            {/* Top Navigation Bar */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'var(--glass-bg)',
                borderBottom: '1px solid var(--glass-border)',
                backdropFilter: 'blur(12px)',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                        <span className="gradient-text">Resume</span>Flow
                    </h1>
                </div>

                {/* Mobile View Toggle */}
                <div className="mobile-only" style={{ display: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
                    <button
                        onClick={() => setActiveTab('edit')}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'edit' ? 'var(--primary)' : 'transparent',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'preview' ? 'var(--primary)' : 'transparent',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Preview
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="desktop-only" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{userEmail}</span>

                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px' }}>
                        <Save size={16} /> <span className="desktop-only">Save</span>
                    </button>

                    <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px', color: 'var(--text-secondary)' }}
                        onClick={handleLogout}
                    >
                        <LogOut size={16} /> <span className="desktop-only">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

                {/* Left Side: Editor Form */}
                <section
                    className={`workspace-pane ${activeTab === 'edit' ? 'active' : ''}`}
                    style={{
                        width: '50%',
                        minWidth: '400px',
                        height: '100%',
                        overflowY: 'auto',
                        borderRight: '1px solid var(--glass-border)',
                        background: 'rgba(11, 15, 25, 0.6)',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    <Editor />
                </section>

                {/* Right Side: Live Preview */}
                <section
                    className={`workspace-pane ${activeTab === 'preview' ? 'active' : ''}`}
                    style={{
                        width: '50%',
                        height: '100%',
                        overflowY: 'auto',
                        background: '#334155',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    <Preview />
                </section>
            </main>

            <style>{`
                @media (max-width: 1024px) {
                    .desktop-only { display: none; }
                    .mobile-only { display: flex !important; }
                    
                    .workspace-pane {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100% !important;
                        min-width: 100% !important;
                        visibility: hidden;
                        transform: translateX(100%);
                    }
                    
                    .workspace-pane.active {
                        visibility: visible;
                        transform: translateX(0);
                    }
                    
                    main {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
