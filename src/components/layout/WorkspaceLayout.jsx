import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const WorkspaceLayout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className={`workspace-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div 
                    className="mobile-overlay mobile-only"
                    onClick={closeMenu}
                />
            )}
            
            <div 
                className="sidebar-placeholder desktop-only"
                style={{ 
                    width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
                    transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    flexShrink: 0
                }}
            >
                <Sidebar 
                    isOpen={isMenuOpen} 
                    onClose={closeMenu} 
                    isCollapsed={isCollapsed} 
                    onToggleCollapse={toggleCollapse} 
                />
            </div>

            {/* Mobile Sidebar (Direct Overlay) */}
            <div className="mobile-only">
                <Sidebar 
                    isOpen={isMenuOpen} 
                    onClose={closeMenu} 
                    isCollapsed={false} 
                    onToggleCollapse={toggleCollapse} 
                />
            </div>

            
            <main className="main-content">
                <Topbar onMenuClick={toggleMenu} />
                <div className="scroll-container" data-lenis-prevent>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default WorkspaceLayout;
