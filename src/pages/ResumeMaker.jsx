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
                alignItems: 'center',
                padding: '16px 24px',
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>AI Resume Maker</h2>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="btn-secondary" style={{ height: '40px', padding: '0 16px', fontSize: '0.85rem' }}>
                        <Save size={16} /> Save Draft
                    </button>
                    <button className="btn-primary" style={{ height: '40px', padding: '0 16px', fontSize: '0.85rem', boxShadow: 'none' }}>
                        <Download size={16} /> Download PDF
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <MoreVertical size={20} />
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
                        borderRight: '1px solid #e2e8f0',
                        background: 'white',
                        transition: 'var(--transition-smooth)'
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
                        background: '#f1f5f9',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '40px',
                        transition: 'var(--transition-smooth)'
                    }}
                >
                    <Preview />
                </section>
            </main>

            <style>{`
                @media (max-width: 1024px) {
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
                }
            `}</style>
        </div>
    );
};

export default ResumeMaker;
