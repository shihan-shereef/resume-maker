import React from 'react';
import { ArrowLeft, Rocket, Shield, Users, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '80px 8%', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: 1.8 }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '32px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back
            </button>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                About <span className="gradient-text">Takshila AI</span>
            </h1>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '48px' }}>
                Takshila AI is the world's most advanced AI Career Operating System, designed to empower professionals with intelligent tools for career growth, application tracking, and skill development.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '16px' }}><Rocket size={32} /></div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Our Mission</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>To democratize high-level career coaching and productivity tools using state-of-the-art Artificial Intelligence.</p>
                </div>
                <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '16px' }}><Shield size={32} /></div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Trust & Safety</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>We prioritize user privacy and data security, leveraging industry-leading infrastructure from Vercel and Supabase.</p>
                </div>
            </div>

            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px' }}>Our Technology</h2>
                <p>
                    Takshila AI integrates multiple AI models and modern web technologies to provide a seamless experience:
                </p>
                <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li><strong>AI Engine:</strong> Powered by Gemini and OpenRouter for intelligent content generation.</li>
                    <li><strong>Infrastructure:</strong> Scalable serverless architecture hosted on Vercel.</li>
                    <li><strong>Database:</strong> Secure, real-time data management via Supabase.</li>
                    <li><strong>Interface:</strong> Built with React and modern CSS for high-performance responsiveness.</li>
                </ul>
            </section>

            <section style={{ padding: '40px', background: '#f8fafc', borderRadius: '24px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Want to know more?</h2>
                <p style={{ marginBottom: '24px' }}>Feel free to reach out to our team for any inquiries or support.</p>
                <button onClick={() => navigate('/contact')} className="btn-primary" style={{ padding: '12px 32px' }}>Contact Support</button>
            </section>
        </div>
    );
};

export default AboutUs;
