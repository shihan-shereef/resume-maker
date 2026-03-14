import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Link as LinkIcon, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            background: 'white',
            borderBottom: '1px solid #f1f5f9',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                <div style={{ position: 'relative', width: '400px' }}>
                    <Search 
                        size={18} 
                        style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} 
                    />
                    <input 
                        type="text" 
                        placeholder="Search AI tools or documents..." 
                        style={{
                            width: '100%',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '100px',
                            padding: '12px 16px 12px 48px',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'var(--transition-smooth)',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
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

                <div style={{ 
                    width: '1px', 
                    height: '24px', 
                    background: '#e2e8f0', 
                    margin: '0 8px' 
                }}></div>

                <button 
                    onClick={handleLogout}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </header>
    );
};

export default Topbar;
