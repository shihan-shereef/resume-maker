import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ type = "404" }) => {
    const navigate = useNavigate();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const content = {
        "404": {
            icon: AlertTriangle,
            title: "404 - Page Not Found",
            desc: "The path you're looking for doesn't exist in the Takshila workspace.",
            action: () => navigate('/'),
            btnText: "Back to Home",
            btnIcon: Home
        },
        "offline": {
            icon: WifiOff,
            title: "You're Offline",
            desc: "Please check your internet connection. Takshila needs to stay connected to keep you productive.",
            action: () => window.location.reload(),
            btnText: "Try Reconnect",
            btnIcon: RefreshCw
        }
    };

    const activeType = isOffline ? "offline" : type;
    const { icon: Icon, title, desc, action, btnText, btnIcon: BtnIcon } = content[activeType] || content["404"];

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-canvas)',
            padding: '20px',
            textAlign: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    padding: '60px 40px',
                    maxWidth: '500px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    background: 'white'
                }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'rgba(255, 92, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '8px'
                }}>
                    <Icon size={40} />
                </div>

                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>{title}</h1>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                </div>

                <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '8px' }}>
                    <button 
                        onClick={action}
                        className="btn-primary" 
                        style={{ flex: 1, height: '56px' }}
                    >
                        <BtnIcon size={20} /> {btnText}
                    </button>
                    {activeType === "404" && (
                         <button 
                         onClick={() => navigate(-1)}
                         className="btn-secondary" 
                         style={{ flex: 1, height: '56px', background: 'white', border: '1px solid #e2e8f0' }}
                     >
                         Go Back
                     </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
