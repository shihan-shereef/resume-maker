import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Zap, Target, Share2, Search, Briefcase, FileText, 
    ArrowRight, Star, CheckCircle2, Globe, Cpu, 
    Github, Mail, Layout, Plus, MessageSquare, 
    Video, Map, Database, Youtube, FileSearch, StickyNote, BarChart
} from 'lucide-react';

import VanillaTilt from 'vanilla-tilt';
import TextScramble from '../utils/TextScramble';
import CanvasParticles from '../components/effects/CanvasParticles';
import Logo from '../components/common/Logo';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        // Vanilla Tilt for cards
        const cards = document.querySelectorAll('.tilt-card');
        VanillaTilt.init(Array.from(cards), {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.12,
        });

        // Intersection Observer for Reveal
        // Parallax Effect
        const handleParallax = () => {
            const scrolled = window.scrollY;
            const parallaxText = document.querySelector('.parallax-text');
            if (parallaxText) {
                parallaxText.style.transform = `translateX(-${scrolled * 0.12}px)`;
            }
        };
        window.addEventListener('scroll', handleParallax);

        // Count-up Numbers
        const countUp = (el) => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();
            
            const animate = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
                el.innerText = Math.floor(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('count-up')) {
                        countUp(entry.target);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal, .letter-reveal, .count-up').forEach(el => observer.observe(el));
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleParallax);
            observer.disconnect();
        };
    }, []);

    const splitText = (text) => {
        return text.split('').map((char, i) => (
            <span key={i} style={{ transitionDelay: `${i * 30}ms` }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    const features = [
        {
            category: "The Career OS",
            title: "Resume Intelligence",
            description: "High-fidelity resume creation with real-time AI optimization and professional templates.",
            icon: <FileText className="w-6 h-6" />,
            color: "#ff5c00"
        },
        {
            category: "The Career OS",
            title: "ATS Optimization",
            description: "Scan your resume against job descriptions to ensure perfect keyword matching.",
            icon: <Target className="w-6 h-6" />,
            color: "#ff008a"
        },
        {
            category: "The Career OS",
            title: "AI Portfolios",
            description: "Generate stunning portfolio websites automatically from your resume data.",
            icon: <Globe className="w-6 h-6" />,
            color: "#7c3aed"
        },
        {
            category: "Productivity Suite",
            title: "YouTube Intelligence",
            description: "Extract core insights and structured summaries from long-form educational videos.",
            icon: <Youtube className="w-6 h-6" />,
            color: "#ef4444"
        },
        {
            category: "Productivity Suite",
            title: "PDF Brain",
            description: "Interact with your PDF documents using AI to extract data, summaries, and facts.",
            icon: <FileSearch className="w-6 h-6" />,
            color: "#3b82f6"
        },
        {
            category: "Productivity Suite",
            title: "Dynamic AI Notes",
            description: "An intelligent note-taking companion that organizes your thoughts and research.",
            icon: <StickyNote className="w-6 h-6" />,
            color: "#10b981"
        },
        {
            category: "Growth & Intelligence",
            title: "Growth Roadmaps",
            description: "Node-based career paths that visualize the skills needed for your next promotion.",
            icon: <Map className="w-6 h-6" />,
            color: "#f59e0b"
        },
        {
            category: "Growth & Intelligence",
            title: "Skill Gap Analysis",
            description: "Data-driven insights into what's missing in your current professional profile.",
            icon: <BarChart className="w-6 h-6" />,
            color: "#8b5cf6"
        },
        {
            category: "Growth & Intelligence",
            title: "Interview Simulator",
            description: "Real-time AI video interviews with posture, confidence, and keyword feedback.",
            icon: <Video className="w-6 h-6" />,
            color: "#ec4899"
        },
        {
            category: "Job Discovery",
            title: "Discovery Matching",
            description: "AI-powered job matching simulations to find the best opportunities for your profile.",
            icon: <Search className="w-6 h-6" />,
            color: "#06b6d4"
        },
        {
            category: "Job Discovery",
            title: "Unified Tracker",
            description: "A centralized command center to manage all your job applications and deadlines.",
            icon: <Database className="w-6 h-6" />,
            color: "#6366f1"
        },
        {
            category: "Job Discovery",
            title: "Cover Letter Engine",
            description: "Context-aware AI that writes tailored cover letters for every unique application.",
            icon: <Plus className="w-6 h-6" />,
            color: "#f97316"
        }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Navigation */}
            <nav style={{
                position: 'fixed', top: 0, width: '100%', zIndex: 1000,
                padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                transition: 'all 0.3s ease',
                borderBottom: scrolled ? '1px solid #f1f5f9' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Logo size="1.8rem" withSound={true} onClick={() => navigate('/')} />
                </div>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', zIndex: 10 }}>
                    <span onClick={() => navigate('/login')} className="hover-underline" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>Login</span>
                    <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                        Join Now
                    </button>
</div>
            </nav>

            {/* Hero Section */}
            <header style={{ 
                padding: '160px 5% 100px', textAlign: 'center', position: 'relative',
                background: 'radial-gradient(circle at 10% 20%, rgba(255, 92, 0, 0.03) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255, 0, 138, 0.03) 0%, transparent 40%)',
                overflow: 'hidden'
            }}>
                <CanvasParticles />
                <div className="animate-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '8px', 
                        padding: '8px 16px', borderRadius: '100px', background: 'rgba(255, 92, 0, 0.05)',
                        color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px'
                    }}>
                        <Zap size={14} /> THE COMPLETE CAREER ECOSYSTEM
                    </div>
                    <h1 className="letter-reveal" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '24px' }}>
                        {splitText("Your Professional Life,")}<br />
                        <span className="gradient-text scramble-text">Unified by Intelligence.</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 40px' }}>
                        Stop juggling a dozen career tools. Discover the only workspace where Resume Building, Interview Simulation, and Career Roadmapping live in perfect harmony.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
                            Start Your Journey <ArrowRight size={20} />
                        </button>
                        <button onClick={() => navigate('/login')} className="btn-secondary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
                            Explore Workspace
                        </button>
                    </div>
                </div>
            </header>

            {/* Visual Showcase - Resume Maker */}
            <section className="scroll-reveal" style={{ padding: '60px 5%' }}>
                <div style={{ 
                    maxWidth: '1200px', margin: '0 auto', display: 'flex', 
                    alignItems: 'center', gap: '60px', flexWrap: 'wrap' 
                }}>
                    <div style={{ flex: '1', minWidth: '320px' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '12px' }}>01. RESUME INTELLIGENCE</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Build the best resume <br/>of your life.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '32px' }}>
                            Our real-time editor uses AI to help you articulate your achievements with precision. Choose from premium templates designed for top-tier tech and corporate roles.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> AI Content Suggestions
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> ATS Keyphrase Matching
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Premium PDF Export
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> One-Click Portfolios
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: '1.5', minWidth: '320px' }}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}>
                            <img 
                                src="/Users/apple/.gemini/antigravity/brain/7a1a696a-9763-458c-818e-a5c257229961/resume_maker_mockup_1773748337446.png" 
                                alt="AI Resume Maker Interface" 
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Ecosystem Grid */}
            <section className="scroll-reveal" style={{ padding: '100px 5%', backgroundColor: '#f8fafc' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>The Complete <span className="gradient-text">Career Ecosystem</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Every professional tool you need, built into a single, cohesive interface. From skill discovery to job mastery.
                    </p>
                </div>
                <div className="responsive-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {features.map((f, i) => (
                        <div key={i} className="glass-card tilt-card" style={{ padding: '40px', background: '#ffffff', textAlign: 'left' }}>
                            <div style={{ 
                                width: '50px', height: '50px', borderRadius: '12px', 
                                backgroundColor: `${f.color}15`, color: f.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                {f.icon}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: f.color, letterSpacing: '0.05em', marginBottom: '8px' }}>
                                {f.category.toUpperCase()}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Visual Showcase - Interview Simulator */}
            <section className="scroll-reveal" style={{ padding: '100px 5%' }}>
                <div style={{ 
                    maxWidth: '1200px', margin: '0 auto', display: 'flex', 
                    alignItems: 'center', gap: '60px', flexWrap: 'wrap-reverse' 
                }}>
                    <div style={{ flex: '1.5', minWidth: '320px' }}>
                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}>
                            <img 
                                src="/Users/apple/.gemini/antigravity/brain/7a1a696a-9763-458c-818e-a5c257229961/interview_simulator_mockup_1773748365170.png" 
                                alt="AI Interview Simulator" 
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: '1', minWidth: '320px' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '12px' }}>02. INTERVIEW INTELLIGENCE</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Simulate success, <br/>before you apply.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '32px' }}>
                            Face professional interviewers built with advanced AI. Get pinpoint feedback on your facial expressions, keyword relevance, and technical accuracy.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 600 }}>
                                <CheckCircle2 size={20} style={{ color: '#ec4899' }} /> Live Video Feedback Loop
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 600 }}>
                                <CheckCircle2 size={20} style={{ color: '#ec4899' }} /> Technical Response Analysis
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontWeight: 600 }}>
                                <CheckCircle2 size={20} style={{ color: '#ec4899' }} /> Confidence & Posture Coaching
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Growth Roadmaps Showcase */}
            <section style={{ padding: '100px 5%', background: '#0f172a', color: '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>Visualize Your <span className="gradient-text">Future.</span></h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                            Experience the ecosystem's intelligence through interactive career roadmaps that evolve with your progress.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img 
                            src="/Users/apple/.gemini/antigravity/brain/7a1a696a-9763-458c-818e-a5c257229961/roadmap_generator_mockup_1773748385126.png" 
                            alt="AI Career Roadmaps" 
                            style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.9 }}
                        />
                    </div>
                </div>
            </section>

            {/* Parallax Strip */}
            <div style={{ padding: '40px 0', background: 'var(--primary)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div className="parallax-text" style={{ fontSize: '5rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)', WebkitTextStroke: '1px rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                    RESUME INTELLIGENCE • INTERVIEW SIMULATION • CAREER ROADMAP • SKILL GAP ANALYSIS • ATS OPTIMIZATION • DISCOVERY MATCHING • RESUME INTELLIGENCE • INTERVIEW SIMULATION • 
                </div>
            </div>

            {/* CTA Section */}
            <section className="scroll-reveal" style={{ padding: '120px 5%', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginBottom: '60px' }}>
                        <div>
                            <div className="count-up" data-target="50000" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>0</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>RESUMES OPTIMIZED</div>
                        </div>
                        <div>
                            <div className="count-up" data-target="12000" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>0</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>INTERVIEWS SIMULATED</div>
                        </div>
                        <div>
                            <div className="count-up" data-target="98" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>0</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>MATCHING ACCURACY %</div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.03em' }}>
                        Ready to join the <br/><span className="gradient-text">Career Ecosystem?</span>
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        Join thousands of professionals using Takshila AI to automate their growth and mastery.
                    </p>
                    <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '20px 60px', fontSize: '1.2rem' }}>
                        Create My Free Account
                    </button>
                    <p style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>No credit card required. Instant access to core workspace.</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '80px 5% 40px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <Logo size="1.4rem" withSound={true} onClick={() => navigate('/')} />
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                            The world's most comprehensive career operating system. Built with modern professionals in mind.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '0.9rem' }}>Navigation</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About Us</span>
                                <span onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Support</span>
                                <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Workspace</span>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '0.9rem' }}>Legal</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</span>
                                <span onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>Terms of Service</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '40px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>© 2026 Takshila AI. All rights reserved. Designed for the future of work.</p>
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
