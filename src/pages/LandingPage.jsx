import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, 
    Sparkles, 
    Zap, 
    Target, 
    LineChart, 
    Globe, 
    Layout, 
    CheckCircle2, 
    ArrowRight,
    Search,
    MessageSquare,
    StickyNote,
    Menu,
    X
} from 'lucide-react';
import { HeroBackground } from '../components/hero-background';

const LandingPage = ({ session }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, []);

    const features = [
        { icon: FileText, title: 'AI Resume Maker', desc: 'Craft professional, ATS-friendly resumes in minutes.' },
        { icon: Sparkles, title: 'Cover Letter Gen', desc: 'Personalized cover letters for every job application.' },
        { icon: MessageSquare, title: 'Interview Prep', desc: 'AI-driven mock interviews with instant feedback.' },
        { icon: LineChart, title: 'Skill Gap Analysis', desc: 'Identify missing skills based on your dream role.' },
        { icon: Target, title: 'Roadmap Generator', desc: 'Visual learning paths to reach your career milestones.' },
        { icon: Globe, title: 'AI Portfolio', desc: 'Stunning portfolio sites generated from your experience.' },
        { icon: Search, title: 'AI Job Search', desc: 'Real-time job discovery powered by Firecrawl.' },
        { icon: Layout, title: 'ATS Checker', desc: 'Scan and optimize your resume for screening bots.' }
    ];

    return (
        <div className="landing-page" style={{ background: 'var(--bg-light)' }}>
            {/* Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                height: 'var(--topbar-height)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 min(8%, 32px)',
                borderBottom: '1px solid #f1f5f9',
                zIndex: 1000
            }}>
                <div 
                    style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer' }}
                    onClick={() => {
                        const audio = new Audio('/splash.wav');
                        audio.volume = 0.5;
                        audio.play().catch(e => console.log('Audio manually triggered', e));
                    }}
                >
                    Takshila<span style={{ color: 'var(--primary)' }}>.</span>
                </div>
                
                {/* Desktop Menu */}
                <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                        EN <span style={{ fontSize: '0.7rem' }}>▼</span>
                    </div>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Log in</button>
                    <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Sign up</button>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="mobile-only"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 'var(--topbar-height)',
                        left: 0, right: 0,
                        background: 'white',
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        borderBottom: '1px solid #f1f5f9',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        zIndex: 999
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 600, paddingBottom: '16px', borderBottom: '1px solid #f8fafc' }}>
                            Language: EN
                        </div>
                        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontWeight: 600, textAlign: 'left', fontSize: '1.1rem' }}>Log in</button>
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%', height: '56px' }}>Sign up for free</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: 'min(200px, 20vh) 5% 80px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent'
            }}>
                <HeroBackground />
                <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 20 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 16px',
                        background: 'white',
                        borderRadius: '100px',
                        fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                        fontWeight: 600,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        marginBottom: '32px'
                    }}>
                        <Sparkles size={14} color="var(--primary)" />
                        The World's Most Advanced AI Career OS
                    </div>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(32px, 8vw, 64px)', 
                        fontWeight: 800, 
                        lineHeight: 1.1, 
                        marginBottom: '20px',
                        letterSpacing: '-0.04em'
                    }}>
                        Elevate Your Career with <br /> 
                        <span className="gradient-text">Takshila AI</span>
                    </h1>
                    
                    <p style={{ 
                        fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
                        color: 'var(--text-secondary)', 
                        maxWidth: '700px', 
                        margin: '0 auto 40px',
                        lineHeight: 1.6,
                        padding: '0 20px'
                    }}>
                        Everything you need for your career growth in one intelligent workspace. 
                        Resume builder, job tracker, interview prep, and learning roadmaps.
                    </p>
                    
                    <div className="mobile-stack" style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '16px',
                        padding: '0 20px'
                    }}>
                        {session ? (
                            <button className="btn-primary" onClick={() => navigate('/portfolio')}>
                                Enter Portfolio Workspace <ArrowRight size={20} />
                            </button>
                        ) : (
                            <>
                                <button className="btn-primary" onClick={() => navigate('/login')}>
                                    Start Using Takshila <ArrowRight size={20} />
                                </button>
                                <button className="btn-secondary" onClick={() => navigate('/login')} style={{ 
                                    background: 'white', 
                                    border: '1px solid #e2e8f0', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: '8px', 
                                    padding: '0 24px'
                                }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                                    Sign in with Google
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="animate-float desktop-only" style={{ position: 'absolute', top: '20%', right: '5%', opacity: 0.1 }}>
                    <Zap size={120} color="var(--primary)" />
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 5%', background: '#fff' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '16px' }}>Powering Your Career Journey</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>A complete suite of AI tools designed for modern professionals.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(max(280px, 45%), 1fr))',
                    gap: '24px'
                }}>
                    {features.map((f, i) => (
                        <div 
                            key={i} 
                            className="glass-card reveal" 
                            style={{ 
                                padding: 'clamp(24px, 5vw, 40px)', 
                                border: '1px solid #f1f5f9',
                                transitionDelay: `${i * 0.05}s`
                            }}
                            onMouseMove={(e) => {
                                if (window.innerWidth <= 1024) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                            }}
                        >
                            <div className="icon-container" style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'rgba(255, 92, 0, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                color: 'var(--primary)'
                            }}>
                                <f.icon size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section style={{ padding: '80px 5%', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800 }}>Seamless Career Growth</h2>
                </div>
                
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                    {[
                        'Sign in with Google instantly',
                        'Create or upload your existing resume',
                        'AI analyzes your skills and formatting',
                        'Receive personalized job recommendations',
                        'Track applications and grow your career'
                    ].map((step, i) => (
                        <div key={i} className="reveal" style={{ 
                            display: 'flex', 
                            gap: 'clamp(16px, 4vw, 32px)', 
                            marginBottom: '32px',
                            transitionDelay: `${i * 0.1}s`
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                flexShrink: 0
                            }}>{i + 1}</div>
                            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 600, color: 'var(--text-primary)', paddingTop: '6px' }}>{step}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <div style={{ padding: '0 5%' }}>
                <section style={{ 
                    padding: 'clamp(60px, 10vw, 100px) 5%', 
                    textAlign: 'center',
                    background: 'var(--text-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-lg)',
                    margin: '40px 0 80px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, marginBottom: '20px' }}>Ready to Launch Your Career?</h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                        Join thousands of professionals using Takshila to navigate their career path.
                    </p>
                    <div className="mobile-stack" style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '16px' 
                    }}>
                        <button className="btn-primary" onClick={() => navigate('/login')} style={{ height: '56px', padding: '0 32px' }}>
                            Start Using Takshila
                        </button>
                        <button onClick={() => navigate('/login')} style={{ 
                            background: 'white', 
                            color: 'var(--text-primary)',
                            padding: '16px 32px',
                            borderRadius: '100px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}>
                             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                             Sign in with Google
                        </button>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer style={{ padding: '60px 5%', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>
                            Takshila<span style={{ color: 'var(--primary)' }}>.</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>© 2026 Takshila AI. All rights reserved.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'max(20px, 4vw)', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</span>
                        <span onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</span>
                        <span onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>Terms of Service</span>
                        <span onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Contact</span>
                    </div>
                </div>
            </footer>

            <style>{`
                .reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal.active {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
