import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const WorkspaceLayout = ({ children }) => {
    return (
        <div className="workspace-layout">
            <Sidebar />
            <main className="main-content">
                <Topbar />
                <div className="scroll-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default WorkspaceLayout;
