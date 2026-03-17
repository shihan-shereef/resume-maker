import { Search, Bell, Sun, Moon, Link as LinkIcon, LogOut, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header style={{
            height: 'var(--topbar-height)',
            background: 'white',
            borderBottom: '1px solid #f1f5f9',
            zIndex: 100,
            position: 'sticky',
            top: 0
        }} className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'max(16px, 2%)', flex: 1 }}>
                <button 
                    onClick={onMenuClick}
                    className="mobile-only"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Menu size={24} />
                </button>

                <div 
                    className="mobile-only"
                    style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginRight: '10px' }}
                >
                    Takshila<span style={{ color: 'var(--primary)' }}>.</span>
                </div>

            <div className="topbar-search-container">
                <Search 
                    size={16} 
                    className="topbar-search-icon"
                />
                <input 
                    type="text" 
                    placeholder="Search AI..." 
                    className="topbar-search-input"
                />
            </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                    className="desktop-only"
                    style={{ 
                        padding: '10px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer' 
                    }}
                >
                    <Bell size={20} color="var(--text-secondary)" />
                </button>

                <div className="desktop-only" style={{ 
                    width: '1px', 
                    height: '24px', 
                    background: '#e2e8f0', 
                    margin: '0 4px' 
                }}></div>

                <button 
                    onClick={handleLogout}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <LogOut size={18} />
                    <span className="desktop-only">Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
