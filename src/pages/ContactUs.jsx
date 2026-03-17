import React, { useState } from 'react';
import { ArrowLeft, Send, Mail, MessageSquare, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Mock submission
    };

    return (
        <div style={{ padding: '80px 8%', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: 1.8 }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '32px', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>Contact <span className="gradient-text">Support</span></h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Have questions about Takshila AI? Our team is here to help you supercharge your career.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Get in Touch</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 92, 0, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Email Us</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>support@takshila.ai</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Live Chat</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Available Mon-Fri, 9am - 5pm EST</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Globe size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Headquarters</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Digital First - Distributed Team globally.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '40px' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ width: '64px', height: '64px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <Send size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Message Sent!</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ marginTop: '24px' }}>Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 600 }}>Full Name</label>
                                <input type="text" className="form-input" placeholder="Your name" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 600 }}>Email Address</label>
                                <input type="email" className="form-input" placeholder="name@example.com" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 600 }}>Message</label>
                                <textarea className="form-input" style={{ height: '120px', resize: 'none', padding: '16px' }} placeholder="How can we help?" required></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ height: '56px', width: '100%' }}>
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
