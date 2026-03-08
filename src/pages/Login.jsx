import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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
            console.log("Success! isLogin:", isLogin);
            if (!isLogin) {
                // Sign up might require email confirmation depending on Supabase settings.
                // So we show an alert or set an error state to inform the user it was successful but requires checking email.
                // For a smoother demo, we'll try to just inform the user instead of letting it silently fail.
                alert("Account created successfully! If email confirmation is required by your Supabase project, please check your email. Otherwise, you can now Sign In.");
                setIsLogin(true); // Switch back to login form
                setLoading(false);
            } else {
                navigate('/'); // Route to main app on success
            }
        }
    };

    const handleGithubLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
    };

    return (
        <div className="login-wrapper animate-fade-in" style={{ width: '100%', maxWidth: '440px', margin: '0 auto', zIndex: 10 }}>
            {/* Animated Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-float">
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                    border: '1px solid var(--glass-border)',
                    marginBottom: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}>
                    <Sparkles size={32} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    <span className="gradient-text">Resume</span>Flow
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                    {isLogin ? 'Welcome back! Log in to continue.' : 'Create your account to get started.'}
                </p>
            </div>

            {/* Glassmorphic Form Card */}
            <div className="glass-panel" style={{ padding: '40px 32px' }}>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5',
                        padding: '14px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        fontWeight: 500
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email" style={{ marginLeft: '4px' }}>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '4px' }}>
                            <label className="form-label" htmlFor="password">Password</label>
                            {isLogin && <a href="#" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}>Forgot?</a>}
                        </div>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '32px 0 24px',
                    color: 'var(--text-secondary)'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    <span style={{ fontSize: '0.875rem', padding: '0 16px', fontWeight: 500 }}>Or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                </div>

                <button
                    type="button"
                    className="btn-secondary"
                    style={{ width: '100%', height: '48px' }}
                    onClick={handleGithubLogin}
                >
                    <Github size={20} />
                    GitHub
                </button>
            </div>

            {/* Footer Link */}
            <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '0.95rem' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        marginLeft: '4px',
                        transition: 'color 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.color = 'var(--primary-hover)'}
                    onMouseOut={(e) => e.target.style.color = 'var(--primary)'}
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
            </div>
        </div>
    );
};

export default Login;
