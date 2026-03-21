import React from 'react';
import { NavLink } from 'react-router-dom';
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
    FileCode, 
    Lightbulb, 
    FolderOpen, 
    UserCircle,
    BookOpenCheck,
    Settings,
    Shield,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Logo from '../common/Logo';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse, user }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    // Effectively collapsed if it's told to be collapsed AND we aren't hovering over it
    const effectivelyCollapsed = isCollapsed && !isHovered;

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
            className={`sidebar ${isOpen ? 'open' : ''} ${effectivelyCollapsed ? 'collapsed' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                position: (isHovered && isCollapsed) ? 'absolute' : undefined,
                boxShadow: (isHovered && isCollapsed) ? '20px 0 50px rgba(0,0,0,0.15)' : undefined,
                backgroundColor: 'white',
                '--sidebar-padding': window.innerWidth < 768 ? '16px' : '32px 24px',
                '--nav-gap': window.innerWidth < 768 ? '2px' : '4px'
            }}
        >
            <div style={{ padding: 'var(--sidebar-padding)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                <div 
                    onClick={() => {
                        const audio = new Audio('/splash.wav');
                        audio.play().catch(e => console.error("Sound play failed", e));
                        onClose();
                        window.location.href = '/';
                    }} 
                    style={{ cursor: 'pointer', overflow: 'hidden' }}
                    title={isCollapsed ? 'Takshila' : ''}
                >
                    {effectivelyCollapsed
                        ? (
                            <div style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 900, 
                                color: '#0F172A', 
                                fontFamily: "'Inter', sans-serif",
                                display: 'inline-flex',
                                alignItems: 'center',
                                minWidth: '32px'
                            }}>
                                T
                                <div style={{ 
                                    width: '6px', 
                                    height: '6px', 
                                    backgroundColor: '#FF5C00', 
                                    borderRadius: '50%', 
                                    marginLeft: '1px',
                                    marginBottom: '-4px' // Better alignment for the dot
                                }} />
                            </div>
                        )
                        : <Logo size="md" />
                    }
                </div>



                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                        onClick={onToggleCollapse}
                        className="desktop-only"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px' }}
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
                style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}
                data-lenis-prevent
            >
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nav-gap)', marginBottom: 'max(16px, 4vh)' }}>
                    {!effectivelyCollapsed && (
                        <div style={{ color: 'var(--text-tertiary)', fontSize: 'min(0.7rem, 3vw)', fontWeight: 800, textTransform: 'uppercase', padding: '0 12px 8px' }}>
                            Career Suite
                        </div>
                    )}

                    {mainModules.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={onClose}
                            title={effectivelyCollapsed ? item.label : ""}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}

                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: effectivelyCollapsed ? 'center' : 'flex-start',
                                gap: '10px',
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: 'min(0.9rem, 4vw)',
                                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                            })}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <item.icon size={window.innerWidth < 768 ? 22 : 26} />
                            </div>
                            {!effectivelyCollapsed && <span className="item-label">{item.label}</span>}

                        </NavLink>
                    ))}
                </nav>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {!effectivelyCollapsed && (
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '0 12px 12px' }}>
                            Productivity AI
                        </div>
                    )}

                    {productivityModules.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            title={effectivelyCollapsed ? item.label : ""}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}

                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: effectivelyCollapsed ? 'center' : 'flex-start',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                            })}


                        >
                            <div>
                                <item.icon size={28} />


                            </div>
                            {!effectivelyCollapsed && <span className="item-label">{item.label}</span>}

                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={{ padding: '24px 16px', borderTop: '1px solid #f1f5f9' }}>
                {user?.email === 'admin@takshila.ai' && (
                    <NavLink
                        to="/admin"
                        onClick={onClose}
                        title={effectivelyCollapsed ? "Admin Hub" : ""}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: effectivelyCollapsed ? 'center' : 'flex-start',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'white' : '#6366f1',
                            background: isActive ? '#6366f1' : 'rgba(99, 102, 241, 0.05)',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                            marginBottom: '12px',
                            border: isActive ? 'none' : '1px solid rgba(99, 102, 241, 0.1)'
                        })}
                    >
                        <div>
                            <Shield size={28} />
                        </div>
                        {!effectivelyCollapsed && <span className="item-label">Admin Hub</span>}
                    </NavLink>
                )}
                <NavLink
                    to="/settings"
                    onClick={onClose}
                    title={effectivelyCollapsed ? "Settings" : ""}
                    style={({ isActive }) => ({

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: effectivelyCollapsed ? 'center' : 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        background: isActive ? 'var(--primary)' : 'transparent',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                        marginBottom: '16px'
                    })}


                >
                    <div>
                        <Settings size={28} />


                    </div>
                    {!effectivelyCollapsed && <span className="item-label">Settings</span>}
                </NavLink>


                <div style={{ 
                    padding: effectivelyCollapsed ? '16px 0' : '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: effectivelyCollapsed ? 'center' : 'flex-start',

                    gap: '12px',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0'
                }} title={effectivelyCollapsed ? "User Account (PREMIUM)" : ""}>

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
                        <UserCircle size={32} />


                    </div>
                    {!effectivelyCollapsed && (
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
