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
            
            <Sidebar 
                isOpen={isMenuOpen} 
                onClose={closeMenu} 
                isCollapsed={isCollapsed} 
                onToggleCollapse={toggleCollapse} 
            />
            
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
