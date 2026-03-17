import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import Preview from '../components/Preview';
import { Save, Download, ArrowLeft, MoreVertical } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const ResumeMaker = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const { resumeData } = useResume();
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email);
            }
        };
        getUser();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
            {/* Local Module Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'center',
                padding: 'min(16px, 3%) min(24px, 4%)',
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                zIndex: 50,
                gap: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'max(12px, 2vw)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, whiteSpace: 'nowrap' }} className="desktop-only">AI Resume Maker</h2>
                    <div style={{ 
                        background: '#f1f5f9', 
                        borderRadius: '12px', 
                        padding: '4px',
                        display: 'flex'
                    }}>
                        <button
                            onClick={() => setActiveTab('edit')}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === 'edit' ? 'white' : 'transparent',
                                color: activeTab === 'edit' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: activeTab === 'edit' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Build
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === 'preview' ? 'white' : 'transparent',
                                color: activeTab === 'preview' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: activeTab === 'preview' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Preview
                        </button>
                    </div>
                </div>

                <div className="resume-maker-header-actions">
                    <button className="btn-secondary" style={{ height: '36px', padding: '0 12px', fontSize: '0.8rem' }}>
                        <Save size={14} /> <span className="desktop-only">Save Draft</span>
                    </button>
                    <button className="btn-primary" style={{ height: '36px', padding: '0 12px', fontSize: '0.8rem', boxShadow: 'none' }}>
                        <Download size={14} /> <span className="desktop-only">Download</span>
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                        <MoreVertical size={18} />
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

                {/* Left Side: Editor Form */}
                <section
                    className={`workspace-pane ${activeTab === 'edit' ? 'active' : ''}`}
                    style={{ background: 'white' }}
                >
                    <Editor />
                </section>

                {/* Right Side: Live Preview */}
                <section
                    className={`workspace-pane ${activeTab === 'preview' ? 'active' : ''}`}
                    style={{
                        background: '#f1f5f9',
                        display: activeTab === 'preview' ? 'flex' : 'none',
                        justifyContent: 'center',
                        padding: 'min(40px, 5%)'
                    }}
                >
                    <Preview />
                </section>
            </main>

        </div>
    );
};

export default ResumeMaker;
