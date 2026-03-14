import React, { useEffect } from 'react';
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
    StickyNote
} from 'lucide-react';
import { HeroBackground } from '../components/hero-background';

const LandingPage = ({ session }) => {
    const navigate = useNavigate();

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
                padding: '0 8%',
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
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                        EN <span style={{ fontSize: '0.7rem' }}>▼</span>
                    </div>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Log in</button>
                    <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Sign up</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '200px 8% 120px',
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
                        padding: '10px 20px',
                        background: 'white',
                        borderRadius: '100px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        marginBottom: '40px'
                    }}>
                        <Sparkles size={16} color="var(--primary)" />
                        The World's Most Advanced AI Career OS
                    </div>
                    
                    <h1 style={{ 
                        fontSize: 'max(48px, 5vw)', 
                        fontWeight: 800, 
                        lineHeight: 1.1, 
                        marginBottom: '24px',
                        letterSpacing: '-0.04em'
                    }}>
                        Elevate Your Career with <br /> 
                        <span className="gradient-text">Takshila AI</span>
                    </h1>
                    
                    <p style={{ 
                        fontSize: '1.25rem', 
                        color: 'var(--text-secondary)', 
                        maxWidth: '700px', 
                        margin: '0 auto 48px',
                        lineHeight: 1.6
                    }}>
                        Everything you need for your career growth in one intelligent workspace. 
                        Resume builder, job tracker, interview prep, and learning roadmaps.
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {session ? (
                            <button className="btn-primary" onClick={() => navigate('/portfolio')}>
                                Enter Portfolio Workspace <ArrowRight size={20} />
                            </button>
                        ) : (
                            <>
                                <button className="btn-primary" onClick={() => navigate('/login')}>
                                    Start Using Takshila <ArrowRight size={20} />
                                </button>
                                <button className="btn-secondary" onClick={() => navigate('/login')} style={{ background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                                    Sign in with Google
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="animate-float" style={{ position: 'absolute', top: '20%', right: '5%', opacity: 0.1 }}>
                    <Zap size={120} color="var(--primary)" />
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '120px 8%', background: '#fff' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Powering Your Career Journey</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>A complete suite of AI tools designed for modern professionals.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px'
                }}>
                    {features.map((f, i) => (
                        <div 
                            key={i} 
                            className="glass-card reveal" 
                            style={{ 
                                padding: '40px', 
                                border: '1px solid #f1f5f9',
                                transitionDelay: `${i * 0.1}s`
                            }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                            }}
                        >
                            <div className="icon-container" style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: 'rgba(255, 92, 0, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                color: 'var(--primary)'
                            }}>
                                <f.icon size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section style={{ padding: '120px 8%', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Seamless Career Growth</h2>
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
                            gap: '32px', 
                            marginBottom: '40px',
                            transitionDelay: `${i * 0.2}s`
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                flexShrink: 0
                            }}>{i + 1}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{step}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ 
                padding: '120px 8%', 
                textAlign: 'center',
                background: 'var(--text-primary)',
                color: 'white',
                borderRadius: '40px',
                margin: '80px 4%',
                boxShadow: '0 40px 100px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>Ready to Launch Your Career?</h2>
                <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                    Join thousands of professionals using Takshila to navigate their career path.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button className="btn-primary" onClick={() => navigate('/login')} style={{ height: '60px', padding: '0 40px' }}>
                        Start Using Takshila
                    </button>
                    <button onClick={() => navigate('/login')} style={{ 
                        background: 'white', 
                        color: 'var(--text-primary)',
                        padding: '0 32px',
                        borderRadius: '100px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                         Sign in with Google
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '80px 8%', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                            Takshila<span style={{ color: 'var(--primary)' }}>.</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>© 2026 Takshila AI. All rights reserved.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '40px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                        <span style={{ cursor: 'pointer' }}>Terms of Service</span>
                        <span style={{ cursor: 'pointer' }}>Contact</span>
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
