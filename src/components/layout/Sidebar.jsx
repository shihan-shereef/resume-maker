import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    FileText, 
    CheckCircle, 
    Mail, 
    MessageSquare, 
    LineChart, 
    Briefcase, 
    Search, 
    Youtube, 
    FileUp, 
    StickyNote, 
    FileCode, 
    Lightbulb, 
    FolderOpen, 
    Settings,
    UserCircle,
    BookOpenCheck,
    BookOpenCheck,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const mainModules = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { id: 'resume', icon: FileText, label: 'AI Resume Maker', path: '/resume' },
        { id: 'ats', icon: CheckCircle, label: 'Resume ATS Checker', path: '/ats-checker' },
        { id: 'cover-letter', icon: Mail, label: 'AI Cover Letter', path: '/cover-letter' },
        { id: 'interview', icon: MessageSquare, label: 'AI Interview Prep', path: '/interview-simulator' },
        { id: 'skill-gap', icon: LineChart, label: 'AI Skill Gap', path: '/skill-gap' },
        { id: 'roadmap', icon: Briefcase, label: 'AI Roadmap', path: '/roadmap' },
        { id: 'portfolio', icon: FileCode, label: 'AI Portfolio', path: '/portfolio' },
    ];

    const productivityModules = [
        { id: 'job-search', icon: Search, label: 'AI Job Search', path: '/job-search' },
        { id: 'tracker', icon: Briefcase, label: 'Job Tracker', path: '/tracker' },
        { id: 'youtube', icon: Youtube, label: 'YouTube Summarizer', path: '/youtube' },
        { id: 'pdf', icon: FileUp, label: 'PDF Summarizer', path: '/pdf' },
        { id: 'notes', icon: BookOpenCheck, label: 'Takshila AI Notes', path: '/notes' },
        { id: 'file-tools', icon: FolderOpen, label: 'File Tools', path: '/file-tools' },
        { id: 'ideas', icon: Lightbulb, label: 'Project Ideas', path: '/ideas' },
    ];

    return (
        <aside 
            className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
            style={{ width: isCollapsed ? '80px' : 'var(--sidebar-width)' }}
        >
            <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div 
                    onClick={() => {
                        const audio = new Audio('/splash.wav');
                        audio.play().catch(e => console.error("Sound play failed", e));
                        onClose();
                        window.location.href = '/';
                    }} 
                    style={{ cursor: 'pointer', display: isCollapsed ? 'none' : 'block' }}
                >
                    <img src="/logo.png" alt="Takshila Logo" style={{ height: '32px', width: 'auto' }} />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="desktop-only"
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    
                    <button 
                        onClick={onClose}
                        className="mobile-only"
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div 
                style={{ flex: '1 1 auto', overflowY: 'auto', padding: '0 16px', minHeight: 0 }}
                data-lenis-prevent
            >
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '0 12px 12px', textAlign: isCollapsed ? 'center' : 'left' }}>
                        {isCollapsed ? '---' : 'Career Suite'}
                    </div>
                    {mainModules.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={onClose}
                            title={isCollapsed ? item.label : ''}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'var(--transition-smooth)'
                            })}
                        >
                            <motion.div whileHover={{ scale: 1.15, rotate: [-5, 5, 0] }} transition={{ type: "spring", stiffness: 300 }}>
                                <item.icon size={20} />
                            </motion.div>
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '0 12px 12px', textAlign: isCollapsed ? 'center' : 'left' }}>
                        {isCollapsed ? '---' : 'Productivity AI'}
                    </div>
                    {productivityModules.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            title={isCollapsed ? item.label : ''}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'var(--transition-smooth)'
                            })}
                        >
                            <motion.div whileHover={{ scale: 1.15, rotate: [-5, 5, 0] }} transition={{ type: "spring", stiffness: 300 }}>
                                <item.icon size={20} />
                            </motion.div>
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={{ padding: '24px 16px', borderTop: '1px solid #f1f5f9' }}>
                <NavLink
                    to="/settings"
                    onClick={onClose}
                    title={isCollapsed ? 'Settings' : ''}
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        background: isActive ? 'var(--primary)' : 'transparent',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        transition: 'var(--transition-smooth)',
                        marginBottom: '16px'
                    })}
                >
                    <motion.div whileHover={{ scale: 1.15, rotate: 45 }} transition={{ type: "spring", stiffness: 200 }}>
                        <Settings size={20} />
                    </motion.div>
                    {!isCollapsed && <span>Settings</span>}
                </NavLink>

                <div style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0
                    }}>
                        <UserCircle size={24} />
                    </div>
                    {!isCollapsed && (
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                User Account
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                                PREMIUM
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
