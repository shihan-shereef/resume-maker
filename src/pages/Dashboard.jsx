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

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{userEmail}</span>

                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px' }}>
                        <Save size={16} /> Save
                    </button>

                    <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px', color: 'var(--text-secondary)' }}
                        onClick={handleLogout}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Side: Editor Form */}
                <section style={{
                    width: '50%',
                    minWidth: '400px',
                    height: '100%',
                    overflowY: 'auto',
                    borderRight: '1px solid var(--glass-border)',
                    background: 'rgba(11, 15, 25, 0.6)'
                }}>
                    <Editor />
                </section>

                {/* Right Side: Live Preview */}
                <section style={{
                    width: '50%',
                    height: '100%',
                    overflowY: 'auto',
                    background: '#8892b0' // Contrast background for a paper feel
                }}>
                    <Preview />
                </section>

            </main>
        </div>
    );
};

export default Dashboard;
