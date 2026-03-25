import React, { useState, useEffect, useRef } from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/TakshilaLogin.css';
import { usePrivacy } from '../context/PrivacyContext';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const { hasAccepted, openPrivacyModal } = usePrivacy();

    useEffect(() => {
        if (!hasAccepted) {
            openPrivacyModal(true);
        }
    }, [hasAccepted, openPrivacyModal]);

    /* ── 3D Dotted Surface Animation ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const isMobile = window.innerWidth < 768;
        const SEPARATION = isMobile ? 180 : 150;
        const AMOUNTX = isMobile ? 20 : 40;
        const AMOUNTY = isMobile ? 30 : 60;
        const CAM_X = 0, CAM_Y = 355, CAM_Z = 1220, FOV_DEG = 60;
        let W, H, aspect, count = 0;
        let rafId;

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            aspect = W / H;
        };
        resize();
        window.addEventListener('resize', resize);

        function project(wx, wy, wz) {
            const cx = wx - CAM_X;
            const cy = wy - CAM_Y;
            const cz = CAM_Z - wz;
            if (cz <= 0) return null;
            const fovRad = (FOV_DEG * Math.PI) / 180;
            const f = 1 / Math.tan(fovRad / 2);
            const ndcX = (cx / cz) * (f / aspect);
            const ndcY = (cy / cz) * f;
            const px = (ndcX + 1) * 0.5 * W;
            const py = (1 - ndcY) * 0.5 * H;
            return { x: px, y: py, cz };
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            const zMin = -(AMOUNTY * SEPARATION) / 2;

            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    const wx = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                    const wz = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
                    const wy = Math.sin((ix + count) * 0.3) * 50
                             + Math.sin((iy + count) * 0.5) * 50;

                    const p = project(wx, wy, wz);
                    if (!p) continue;
                    if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;

                    const depthT = Math.max(0, Math.min(1, 1 - (p.cz - 20) / (CAM_Z - zMin)));
                    const waveN  = (Math.sin((ix + count) * 0.3) + Math.sin((iy + count) * 0.5) + 2) / 4;

                    const fovRad = (FOV_DEG * Math.PI) / 180;
                    const focal  = 1 / Math.tan(fovRad / 2);
                    const r = Math.max(0.4, Math.min(3.2, (8 * focal / p.cz) * (H * 0.5) * 0.9));

                    const alpha   = Math.max(0, Math.min(0.75, 0.04 + depthT * 0.5 + waveN * 0.22));
                    const brightT = 0.4 + depthT * 0.4 + waveN * 0.2;
                    const rr = Math.round(240 + (255 - 240) * (1 - brightT));
                    const gg = Math.round(85  * brightT);
                    const bb = Math.round(35  * brightT);

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha.toFixed(2)})`;
                    ctx.fill();
                }
            }

            count += 0.1;
            rafId = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    const handleGoogleLogin = async () => {
        if (!hasAccepted) {
            openPrivacyModal(true);
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        if (!hasAccepted) {
            openPrivacyModal(true);
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <canvas ref={canvasRef} id="dotCanvas" />

            <Link to="/" className="auth-nav-logo">
                <span className="auth-logo-text">Takshila<em>.</em></span>
            </Link>


            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-header">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <div style={{ padding: '12px', background: 'rgba(240, 85, 35, 0.1)', borderRadius: '16px', color: 'var(--orange)' }}>
                                <ShieldCheck size={32} />
                            </div>
                        </div>
                        <h1 className="auth-title">Secure Portal</h1>
                        <p className="auth-sub">
                            Join the unified AI career workspace with verified social auth.
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div className="auth-oauth-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                        <button 
                            className="auth-oauth-btn large" 
                            onClick={handleGoogleLogin} 
                            disabled={loading}
                            type="button" 
                            style={{ height: '60px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}
                        >
                                <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07 7.07 l 3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            {loading ? 'Entering Workspace...' : 'Continue with Google'}
                        </button>
                        <button 
                            className="auth-oauth-btn large" 
                            onClick={handleGithubLogin} 
                            disabled={loading}
                            type="button" 
                            style={{ height: '60px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                            {loading ? 'Connecting...' : 'Continue with GitHub'}
                        </button>
                    </div>

                    <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <p>By continuing, you agree to our <a href="#" onClick={(e) => { e.preventDefault(); openPrivacyModal(); }} style={{ color: 'var(--primary)', fontWeight: 700 }}>Privacy Policy</a> and Terms of Service.</p>
                        <p style={{ marginTop: '16px', opacity: 0.7 }}>Verified Social Login via Supabase Auth & Vercel Edge.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
