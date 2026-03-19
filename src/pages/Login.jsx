import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = isLogin
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (!isLogin) {
                alert("Account created successfully! Please check your email for confirmation.");
                setIsLogin(true);
                setLoading(false);
            } else {
                navigate('/portfolio');
            }
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/portfolio'
            }
        });
        if (error) setError(error.message);
    };

    const handleGithubLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/portfolio'
            }
        });
        if (error) setError(error.message);
    };

    return (
        <div className="login-layout">
            {/* Left Column: Login Form */}
            <div className="login-form-side">
                <div className="login-logo-container">
                    <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Takshila<span style={{ color: 'var(--primary)' }}>.</span>
                    </Link>
                </div>

                <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
                    <h1 style={{ 
                        fontSize: 'clamp(2.2rem, 8vw, 2.8rem)', 
                        fontWeight: 800, 
                        marginBottom: '12px', 
                        letterSpacing: '-0.04em', 
                        color: 'var(--text-primary)' 
                    }}>
                        {isLogin ? 'Sign In' : 'Join Takshila'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1rem', fontWeight: 500 }}>
                        Experience the AI productivity revolution.
                    </p>

                    {error && (
                        <div style={{
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            color: '#e11d48',
                            padding: '16px',
                            borderRadius: '16px',
                            marginBottom: '24px',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="auth-social-buttons">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            style={{ 
                                flex: 1, 
                                height: '60px', 
                                background: '#fff', 
                                color: '#1f2937', 
                                fontWeight: 700, 
                                border: '1px solid #d1d5db', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '12px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#f9fafb';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            }}
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                            Google
                        </button>

                        <button
                            type="button"
                            onClick={handleGithubLogin}
                            style={{ 
                                flex: 1, 
                                height: '60px', 
                                background: '#fff', 
                                color: '#1f2937', 
                                fontWeight: 700, 
                                border: '1px solid #d1d5db', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '12px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#f9fafb';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            }}
                        >
                            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{ width: '24px' }} />
                            GitHub
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '32px 0',
                        color: 'var(--text-tertiary)'
                    }}>
                        <div style={{ flex: 1, height: '1.5px', background: '#f1f5f9' }}></div>
                        <span style={{ fontSize: '0.7rem', padding: '0 16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Or continue with email</span>
                        <div style={{ flex: 1, height: '1.5px', background: '#f1f5f9' }}></div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#64748b' }}>Email address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '56px', height: '60px', borderRadius: '100px', background: '#f8fafc' }}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                                <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Password</label>
                                {isLogin && <a href="#" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>Forgot password?</a>}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '56px', height: '60px', borderRadius: '100px', background: '#f8fafc' }}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ 
                                height: '60px', 
                                marginTop: '12px', 
                                borderRadius: '100px', 
                                fontSize: '1.1rem',
                                width: '100%',
                                background: 'var(--primary)'
                            }} 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontWeight: 800,
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>

                <div style={{ 
                    position: 'absolute', 
                    bottom: '40px', 
                    left: '10%', 
                    right: '10%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '24px', 
                    fontSize: '0.85rem', 
                    color: '#94a3b8',
                    fontWeight: 600
                }}>
                    <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
                    <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
                    <span>Cookies</span>
                </div>
            </div>

            {/* Right Column: Visual Panel */}
            <div 
                className="desktop-only"
                style={{
                    flex: '0 0 50%',
                    background: 'linear-gradient(135deg, #ff5c00 0%, #ff008a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div className="animate-float" style={{ textAlign: 'center', zIndex: 10 }}>
                    <div style={{
                        width: '320px',
                        height: '320px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(40px)',
                        borderRadius: '80px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
                        marginBottom: '48px',
                        margin: '0 auto 48px'
                    }}>
                        <Sparkles size={140} color="white" />
                    </div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '20px' }}>
                        Elevate Your <br /> Career Path
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', maxWidth: '440px', margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>
                        The intelligent workspace designed to empower the next generation of professionals.
                    </p>
                </div>

                {/* Abstract Glass Elements */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '150px', height: '150px', borderRadius: '40px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', transform: 'rotate(15deg)' }}></div>
                <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '120px', height: '120px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', transform: 'rotate(-25deg)' }}></div>
                
                {/* Large Background Glows */}
                <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', filter: 'blur(120px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,0,138,0.3)', filter: 'blur(100px)' }}></div>
            </div>
        </div>
    );
};

export default Login;
