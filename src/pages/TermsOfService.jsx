import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '80px 8%', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: 1.8 }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '32px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px' }}>Terms of Service</h1>
            <p>Last Updated: March 16, 2026</p>
            
            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>1. Agreement to Terms</h2>
                <p>By accessing or using Takshila AI, located at resume-maker-t96i.vercel.app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>2. AI Simulation Disclaimer</h2>
                <p><strong>IMPORTANT:</strong> Takshila AI uses large language models to generate career-related content. Features such as Job Discovery and Interview Simulation provide AI-generated results for educational and productivity purposes. These results do not always reflect real-time live data and should be verified independently by the user.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>3. Description of Service</h2>
                <p>Takshila AI is an AI-powered career productivity platform. Our services include resume building, ATS checking, interview simulation, and career roadmap generation. We reserve the right to modify or discontinue any part of the service at any time.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>4. User Conduct</h2>
                <p>You agree not to use the service for any purpose that is prohibited by law or these Terms. You are responsible for the accuracy of the information you provide and for maintaining the security of your account.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>5. Limitation of Liability</h2>
                <p>Takshila AI is provided "as is" without warranties of any kind. In no event shall we be liable for any damages arising out of your use of the service or reliance on AI-generated content.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
