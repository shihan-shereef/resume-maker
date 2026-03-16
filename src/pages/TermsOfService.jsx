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
                <p>By accessing or using Takshila AI, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to all of these terms, do not use our services.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>2. Description of Service</h2>
                <p>Takshila AI is an AI-powered career productivity platform. Our services include resume building, ATS checking, interview simulation, and career roadmap generation.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>3. User Conduct</h2>
                <p>You agree not to use the service for any purpose that is prohibited by these Terms. You are responsible for all of your activity in connection with the service.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>4. Limitation of Liability</h2>
                <p>In no event shall Takshila AI be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
