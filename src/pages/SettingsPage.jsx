import React, { useState, useEffect } from 'react';
import { 
    User, 
    Shield, 
    Bell, 
    Globe, 
    Moon, 
    Sun, 
    LogOut, 
    Trash2, 
    ExternalLink, 
    Camera, 
    Lock,
    Save,
    History,
    HardDrive,
    Key,
    Smartphone
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(localStorage.getItem('user_avatar') || null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('English');
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                localStorage.setItem('user_avatar', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);
        };
        getSession();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.classList.toggle('dark-theme', newTheme === 'dark');
    };

    const handleLogoutAll = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const APIIntegrationsSettings = () => {
        const [orKey, setOrKey] = useState(localStorage.getItem('VITE_OPENROUTER_API_KEY') || '');
        const [elKey, setElKey] = useState(localStorage.getItem('VITE_ELEVENLABS_API_KEY') || '');
        const [status, setStatus] = useState('');

        const isEnvOrPresent = !!import.meta.env.VITE_OPENROUTER_API_KEY;
        const isEnvElPresent = !!import.meta.env.VITE_ELEVENLABS_API_KEY;

        const handleSaveKeys = () => {
            localStorage.setItem('VITE_OPENROUTER_API_KEY', orKey);
            localStorage.setItem('VITE_ELEVENLABS_API_KEY', elKey);
            setStatus('Keys saved successfully! Refresh to apply.');
            setTimeout(() => setStatus(''), 3000);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Paste your API keys here if they are missing in the production environment. They will be saved securely in your browser's local storage.
                </p>
                
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        OpenRouter API Key 
                        {isEnvOrPresent && <span style={{ color: '#10b981', fontSize: '0.7rem' }}>● DETECTED IN ENV</span>}
                    </label>
                    <input 
                        type="password" 
                        className="form-input" 
                        placeholder="sk-or-v1-..." 
                        value={orKey}
                        onChange={(e) => setOrKey(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        ElevenLabs API Key
                        {isEnvElPresent && <span style={{ color: '#10b981', fontSize: '0.7rem' }}>● DETECTED IN ENV</span>}
                    </label>
                    <input 
                        type="password" 
                        className="form-input" 
                        placeholder="Paste ElevenLabs Key" 
                        value={elKey}
                        onChange={(e) => setElKey(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="btn-primary" onClick={handleSaveKeys} style={{ flex: 1 }}>
                        <Save size={18} /> Save Keys
                    </button>
                    {status && <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>{status}</span>}
                </div>
            </div>
        );
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is permanent.')) {
            // In a real app, you'd call a Supabase function to delete the user record
            alert('Account deletion request received.');
        }
    };

    const settingsSections = [
        {
            id: 'profile',
            title: 'Profile Settings',
            icon: User,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '100px', 
                                height: '100px', 
                                borderRadius: '50%', 
                                background: profileImage ? 'none' : 'linear-gradient(135deg, #ff5c00 0%, #ff008a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                overflow: 'hidden',
                                border: profileImage ? '4px solid white' : 'none',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                            }}>
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            <label style={{ 
                                position: 'absolute', 
                                bottom: '0', 
                                right: '0', 
                                background: 'white', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '50%', 
                                padding: '8px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex'
                            }}>
                                <Camera size={16} color="var(--primary)" />
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user?.user_metadata?.full_name || 'User Name'}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" defaultValue={user?.user_metadata?.full_name} placeholder="John Doe" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" defaultValue={user?.email} disabled />
                        </div>
                    </div>
                    <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            )
        },
        {
            id: 'account',
            title: 'Account Settings',
            icon: Lock,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Connected Google Account</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                            </div>
                        </div>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>CONNECTED</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleLogoutAll} className="btn-secondary" style={{ flex: 1, color: 'var(--text-secondary)' }}>
                            <LogOut size={16} /> Logout from all sessions
                        </button>
                        <button onClick={handleDeleteAccount} className="btn-secondary" style={{ flex: 1, color: '#ef4444', borderColor: '#fee2e2' }}>
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 'workspace',
            title: 'Workspace Preferences',
            icon: Globe,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>Appearance</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Light or dark theme for Takshila</div>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className="btn-secondary"
                            style={{ 
                                padding: '8px 16px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                background: theme === 'dark' ? '#0f172a' : '#f8fafc',
                                color: theme === 'dark' ? 'white' : 'var(--text-primary)'
                            }}
                        >
                            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>Language</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select your preferred language</div>
                        </div>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="form-input" 
                            style={{ width: '150px', padding: '10px 16px' }}
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>Notifications</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email and browser alerts</div>
                        </div>
                        <div 
                            onClick={() => setNotifications(!notifications)}
                            style={{ 
                                width: '48px', 
                                height: '24px', 
                                background: notifications ? 'var(--primary)' : '#cbd5e1',
                                borderRadius: '100px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                        >
                            <div style={{ 
                                width: '18px', 
                                height: '18px', 
                                background: 'white', 
                                borderRadius: '50%', 
                                position: 'absolute', 
                                top: '3px',
                                left: notifications ? '27px' : '3px',
                                transition: '0.3s'
                            }} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'security',
            title: 'Security Settings',
            icon: Shield,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                            <History size={18} color="var(--text-tertiary)" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Last Login</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mumbai, India • March 13, 2026, 02:15 AM</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                            <Smartphone size={18} color="var(--text-tertiary)" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Active Session</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Chrome on macOS • Current</div>
                            </div>
                        </div>
                    </div>
                    <button className="btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>
                        <Key size={16} /> Manage authentication methods
                    </button>
                </div>
            )
        },
        {
            id: 'files',
            title: 'File Management',
            icon: HardDrive,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 600 }}>Storage Usage</span>
                            <span style={{ color: 'var(--text-secondary)' }}>24.5 MB / 100 MB</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ width: '24.5%', height: '100%', background: 'linear-gradient(90deg, #ff5c00, #ff008a)' }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                            { name: 'resume_v2_final.pdf', size: '1.2 MB' },
                            { name: 'cover_letter_google.pdf', size: '0.8 MB' }
                        ].map((file, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{file.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{file.size}</span>
                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'api',
            title: 'API & Integrations',
            icon: Key,
            content: <APIIntegrationsSettings />
        },
        {
            id: 'history',
            title: 'Workspace History',
            icon: History,
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activities</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>View your previously generated content and applications.</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Job Applications (Tracker)</div>
                            {JSON.parse(localStorage.getItem('tracked_jobs') || '[]').slice(0, 3).map((job, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', padding: '8px 0', fontSize: '0.85rem' }}>
                                    <span style={{ fontWeight: 600 }}>{job.role} at {job.company}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>Status: {job.status}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Saved Notes</div>
                            {JSON.parse(localStorage.getItem('workspace_notes') || '[]').slice(0, 3).map((note, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', padding: '8px 0', fontSize: '0.85rem' }}>
                                    <span style={{ fontWeight: 600 }}>{note.title || 'Untitled'}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Recent AI Resumes</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', padding: '8px 0', fontSize: '0.85rem' }}>
                                <span style={{ fontWeight: 600 }}>Software Engineer Profile (Corporate)</span>
                                <span style={{ color: 'var(--text-secondary)' }}>Exported PDF</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    letterSpacing: '0.1em'
                }}>
                    <User size={16} />
                    Account Control
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Workspace <span className="gradient-text">Settings</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Manage your profile, security, and personal preferences.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
                {settingsSections.map((section) => (
                    <div key={section.id} className="glass-card" style={{ padding: '32px', background: 'white', border: 'none', height: 'fit-content' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '12px', 
                                background: 'rgba(255, 92, 0, 0.05)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <section.icon size={22} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{section.title}</h2>
                        </div>
                        {section.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SettingsPage;
