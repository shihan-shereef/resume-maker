import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const WorkspaceLayout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="workspace-layout">
            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div 
                    className="mobile-overlay mobile-only"
                    onClick={closeMenu}
                />
            )}
            
            <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
            
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
