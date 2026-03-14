import React, { useState, useEffect } from 'react';
import { Layout, Palette, Code, Sparkles, Plus, Eye, Edit3, Trash2, ExternalLink, ArrowRight, Save, Wand2, Monitor, Tablet, Phone, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';
import { generateResumeContent } from '../lib/openrouter';

const PortfolioPage = () => {
    const { resumeData } = useResume();
    const [portfolios, setPortfolios] = useState(() => {
        const saved = localStorage.getItem('takshila_portfolios');
        return saved ? JSON.parse(saved) : [];
    });
    const [view, setView] = useState('dashboard'); // 'dashboard', 'templates', 'editor', 'preview'
    const [activePortfolio, setActivePortfolio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState('desktop');

    useEffect(() => {
        localStorage.setItem('takshila_portfolios', JSON.stringify(portfolios));
    }, [portfolios]);

    const handleCreateNew = () => {
        setView('templates');
    };

    const handleSelectTemplate = (template) => {
        setLoading(true);
        // Simulate AI generation or template application
        setTimeout(() => {
            const newPortfolio = {
                id: Date.now().toString(),
                name: `My ${template.name} Portfolio`,
                templateId: template.id,
                content: resumeData, // Initial content from resume
                createdAt: new Date().toISOString(),
                theme: template.defaultTheme || { primary: '#6366f1', background: '#ffffff' }
            };
            setPortfolios([newPortfolio, ...portfolios]);
            setActivePortfolio(newPortfolio);
            setLoading(false);
            setView('editor');
        }, 1500);
    };

    const handleAIGenerate = async () => {
        setLoading(true);
        try {
            const prompt = `Create a stunning portfolio website structure for a ${resumeData.personalInfo.jobTitle}. 
            Resume Content: ${JSON.stringify(resumeData)}
            
            Return a JSON object with:
            1. hero: { title, subtitle, cta }
            2. sections: [ { id, title, content } ]
            3. colors: { primary, secondary, accent }
            4. Animations: [ { element, effect } ] (e.g., hover-tilt, scroll-reveal)
            
            Make it incredibly professional and modern.`;

            const response = await generateResumeContent(prompt, "You are a world-class web designer and portfolio expert.");
            const aiData = JSON.parse(response.replace(/```json|```/g, '').trim());

            const newPortfolio = {
                id: Date.now().toString(),
                name: `AI Generated Portfolio - ${resumeData.personalInfo.firstName}`,
                templateId: 'ai-custom',
                content: { ...resumeData, aiCustom: aiData },
                createdAt: new Date().toISOString(),
                theme: { primary: aiData.colors?.primary || '#6366f1', background: '#f8fafc' }
            };

            setPortfolios([newPortfolio, ...portfolios]);
            setActivePortfolio(newPortfolio);
            setView('editor');
        } catch (err) {
            console.error("AI Generation failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setPortfolios(portfolios.filter(p => p.id !== id));
    };

    const renderDashboard = () => (
        <div className="animate-fade-in" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                        AI <span className="gradient-text">Portfolio Workspace</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Create, edit, and manage your professional presence with Wix-style ease.
                    </p>
                </div>
                <button 
                    className="btn-primary" 
                    style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={handleCreateNew}
                >
                    <Plus size={20} /> Create New Portfolio
                </button>
            </div>

            {portfolios.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px', 
                    background: 'white', 
                    borderRadius: '24px', 
                    border: '2px dashed #e2e8f0' 
                }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
                        <Monitor size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>No Portfolios Yet</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
                        Transform your resume into a stunning, interactive portfolio website in seconds using our AI builder.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={handleCreateNew}>Choose a Template</button>
                        <button className="btn-secondary" onClick={handleAIGenerate} disabled={loading}>
                            {loading ? 'Generating...' : 'Magic AI Generate'} <Wand2 size={16} style={{ marginLeft: '8px' }} />
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {portfolios.map(p => (
                        <motion.div 
                            key={p.id}
                            layoutId={p.id}
                            className="glass-card"
                            whileHover={{ y: -8 }}
                            style={{ padding: '0', overflow: 'hidden', border: 'none', background: 'white' }}
                        >
                            <div style={{ height: '200px', background: `linear-gradient(135deg, ${p.theme.primary}22 0%, ${p.theme.primary}44 100%)`, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <Layout size={48} color={p.theme.primary} opacity={0.5} />
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{p.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>Created on {new Date(p.createdAt).toLocaleDateString()}</p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        className="btn-secondary" 
                                        style={{ flex: 1, padding: '10px' }}
                                        onClick={() => { setActivePortfolio(p); setView('editor'); }}
                                    >
                                        <Edit3 size={16} /> Edit
                                    </button>
                                    <button 
                                        className="btn-secondary" 
                                        style={{ flex: 1, padding: '10px' }}
                                        onClick={() => { setActivePortfolio(p); setView('preview'); }}
                                    >
                                        <Eye size={16} /> Preview
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(p.id)}
                                        style={{ padding: '10px', borderRadius: '10px', background: '#fef2f2', border: 'none', color: '#dc2626' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderTemplates = () => {
        const mockTemplates = [
            { id: 'neo-brutal', name: 'Neo Brutalist', color: '#ff4d4d', effect: 'Bold Shadows', theme: { primary: '#ff4d4d', secondary: '#000000', background: '#ffffff', animation: 'stagger' } },
            { id: 'glass-pro', name: 'Glassmorphism Pro', color: '#6366f1', effect: 'Blur & Transparency', theme: { primary: '#6366f1', secondary: '#ffffff', background: '#f0f9ff', animation: 'float' } },
            { id: 'cyber-dark', name: 'Cyberpunk Dark', color: '#00ff41', effect: 'Neon Glows', theme: { primary: '#00ff41', secondary: '#111111', background: '#0a0a0a', animation: 'glitch' } },
            { id: 'minimal-zen', name: 'Minimal Zen', color: '#0f172a', effect: 'Soft Reveals', theme: { primary: '#0f172a', secondary: '#f8fafc', background: '#ffffff', animation: 'fade' } },
            { id: 'parallax-dev', name: 'Parallax Developer', color: '#3b82f6', effect: 'Smooth Scrolling', theme: { primary: '#3b82f6', secondary: '#1e293b', background: '#f1f5f9', animation: 'parallax' } },
            { id: 'bento-master', name: 'Bento Grid Layout', color: '#f59e0b', effect: 'Tiled Design', theme: { primary: '#f59e0b', secondary: '#ffffff', background: '#fafaf9', animation: 'pop' } },
            { id: 'futuristic-gradient', name: 'Cosmic Flow', color: '#8b5cf6', effect: 'Animated Gradients', theme: { primary: '#8b5cf6', secondary: '#ec4899', background: '#0f172a', animation: 'aurora' } },
            { id: 'swiss-mono', name: 'Swiss Mono', color: '#000000', effect: 'Typography Focused', theme: { primary: '#000000', secondary: '#ffffff', background: '#ffffff', animation: 'slide' } },
            { id: 'soft-clay', name: 'Claymorphism Soft', color: '#6ee7b7', effect: 'Inner Shadows', theme: { primary: '#6ee7b7', secondary: '#ffffff', background: '#f0fdf4', animation: 'bounce' } },
            { id: 'retro-vhs', name: 'Retro VHS', color: '#f43f5e', effect: 'CRT Scanlines', theme: { primary: '#f43f5e', secondary: '#fbbf24', background: '#2e1065', animation: 'scanline' } },
            { id: 'luxury-gold', name: 'Luxury Gold', color: '#d97706', effect: 'Metallic Accents', theme: { primary: '#d97706', secondary: '#ffffff', background: '#09090b', animation: 'shine' } },
            { id: 'eco-natural', name: 'Eco Natural', color: '#10b981', effect: 'Organic Shapes', theme: { primary: '#10b981', secondary: '#ecfdf5', background: '#ffffff', animation: 'leaf-flow' } },
            { id: 'tech-blueprint', name: 'Tech Blueprint', color: '#2563eb', effect: 'Grid Overlays', theme: { primary: '#2563eb', secondary: '#000000', background: '#000000', animation: 'terminal' } }
        ];

        return (
            <div className="animate-fade-in" style={{ padding: '20px' }}>
                <button className="btn-secondary" onClick={() => setView('dashboard')} style={{ marginBottom: '24px' }}>
                    <ChevronLeft size={16} /> Back to Dashboard
                </button>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Choose Your <span className="gradient-text">Master Design</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Selection of 27+ optimized layouts with advanced hover and scroll effects.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {mockTemplates.map(t => (
                        <motion.div 
                            key={t.id}
                            className="glass-card"
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            style={{ padding: '0', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s ease' }}
                            onClick={() => handleSelectTemplate(t)}
                        >
                            <div style={{ height: '180px', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <Sparkles size={40} color="white" />
                                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>PREMIUM</div>
                            </div>
                            <div style={{ padding: '24px', background: 'white' }}>
                                <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px' }}>{t.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Effect: {t.effect}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    const renderEditor = () => (
        <div style={{ display: 'flex', height: 'calc(100vh - 120px)', background: '#f8fafc', margin: '-20px', overflow: 'hidden' }}>
            {/* Sidebar Editor */}
            <div style={{ width: '350px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontWeight: 800 }}>Site Editor</h3>
                    <button className="btn-secondary" onClick={() => setView('dashboard')} style={{ padding: '4px 8px' }}>
                        Exit
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="form-group">
                        <label className="form-label">Site Name</label>
                        <input className="form-input" value={activePortfolio.name} onChange={(e) => setActivePortfolio({...activePortfolio, name: e.target.value})} />
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px', letterSpacing: '0.05em' }}>Design System</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                                <Palette size={18} style={{ margin: '0 auto 8px' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Colors</span>
                            </div>
                            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                                <Sparkles size={18} style={{ margin: '0 auto 8px' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Effects</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px', letterSpacing: '0.05em' }}>Sections</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['Hero', 'About', 'Experience', 'Projects', 'Contact'].map(s => (
                                <div key={s} style={{ padding: '12px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{s}</span>
                                    <Edit3 size={14} color="#94a3b8" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                    <button className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
                        <Save size={18} /> Save & Publish
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', background: 'white', padding: '8px', borderRadius: '12px', alignSelf: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <button 
                        onClick={() => setPreviewMode('desktop')}
                        style={{ padding: '8px', borderRadius: '8px', border: 'none', background: previewMode === 'desktop' ? '#f1f5f9' : 'transparent' }}
                    >
                        <Monitor size={18} />
                    </button>
                    <button 
                        onClick={() => setPreviewMode('tablet')}
                        style={{ padding: '8px', borderRadius: '8px', border: 'none', background: previewMode === 'tablet' ? '#f1f5f9' : 'transparent' }}
                    >
                        <Tablet size={18} />
                    </button>
                    <button 
                        onClick={() => setPreviewMode('phone')}
                        style={{ padding: '8px', borderRadius: '8px', border: 'none', background: previewMode === 'phone' ? '#f1f5f9' : 'transparent' }}
                    >
                        <Phone size={18} />
                    </button>
                </div>

                <div style={{ 
                    flex: 1, 
                    background: 'white', 
                    borderRadius: previewMode === 'desktop' ? '0' : '24px', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    maxWidth: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
                    margin: '0 auto',
                    width: '100%',
                    overflow: 'hidden',
                    border: '8px solid white',
                    transition: 'all 0.3s ease'
                }}>
                    <iframe 
                        title="Portfolio Preview"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        srcDoc={`
                            <html>
                                <head>
                                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
                                    <style>
                                        body { 
                                            margin: 0; 
                                            font-family: 'Outfit', sans-serif; 
                                            color: #0f172a; 
                                            background: ${activePortfolio.theme.background};
                                            overflow-x: hidden;
                                        }
                                        .container { padding: 80px 40px; }
                                        .hero { height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(to bottom, ${activePortfolio.theme.primary}11, transparent); }
                                        h1 { font-size: 4rem; font-weight: 800; margin: 0; letter-spacing: -2px; }
                                        p { font-size: 1.25rem; color: #64748b; margin-top: 20px; }
                                        .card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); margin-top: 40px; transition: transform 0.3s ease; }
                                        .card:hover { transform: translateY(-10px); }
                                        .badge { display: inline-block; padding: 4px 12px; border-radius: 100px; background: ${activePortfolio.theme.primary}22; color: ${activePortfolio.theme.primary}; font-weight: 700; font-size: 0.8rem; }
                                    </style>
                                </head>
                                <body>
                                    <div class="hero">
                                        <div class="badge">Professional Portfolio</div>
                                        <h1>Hi, I'm ${activePortfolio.content.personalInfo.firstName}</h1>
                                        <p>${activePortfolio.content.personalInfo.jobTitle}</p>
                                    </div>
                                    <div class="container">
                                        <h2>About Me</h2>
                                        <p>${activePortfolio.content.summary}</p>
                                        
                                        <h2>Featured Projects</h2>
                                        <div class="card">
                                            <h3>AI Portfolio Builder</h3>
                                            <p>A sophisticated platform for creating interactive portfolios.</p>
                                        </div>
                                    </div>
                                </body>
                            </html>
                        `}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {view === 'dashboard' && renderDashboard()}
            {view === 'templates' && renderTemplates()}
            {view === 'editor' && renderEditor()}
            {loading && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                    <div style={{ width: '60px', height: '60px', border: '5px solid #e2e8f0', borderTop: `5px solid var(--primary)`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '20px', fontWeight: 800 }}>AI is crafting your masterpiece...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}
        </div>
    );
};

export default PortfolioPage;
