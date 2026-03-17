import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '80px 8%', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: 1.8 }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '32px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px' }}>Privacy Policy</h1>
            <p>Last Updated: March 16, 2026</p>
            
            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>1. Introduction</h2>
                <p>Welcome to Takshila AI. We respect your privacy and are committed to protecting your personal data. Takshila AI is a productivity platform designed to help users build careers. This policy explains how we handle your information when you use our web application hosted at resume-maker-t96i.vercel.app.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>2. The Data We Collect</h2>
                <p>We collect information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, or when you participate in activities on the Services.</p>
                <ul>
                    <li><strong>Identity Data:</strong> includes first name, last name, and profile pictures from OAuth providers (Google/GitHub).</li>
                    <li><strong>Contact Data:</strong> includes email address for account authentication.</li>
                    <li><strong>Career Data:</strong> includes employment history, education, and resume content you input or upload for AI processing.</li>
                </ul>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>3. How We Use Your Data</h2>
                <p>We use personal information collected via our Services for a variety of business purposes described below:</p>
                <ul>
                    <li>To facilitate account creation and logon process.</li>
                    <li>To provide AI-powered career services (Resume building, ATS checking, etc.).</li>
                    <li>To respond to user inquiries and offer support.</li>
                    <li>To protect our Services from fraudulent activity.</li>
                </ul>
                <p><strong>We do not sell your personal data to third parties.</strong></p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>4. Data Security & Storage</h2>
                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. All data is stored securely using Supabase (managed Postgres) and hosted on Vercel's secure cloud infrastructure. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>5. Your Privacy Rights</h2>
                <p>Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. You can manage your profile and data within the Settings page of the application.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
