import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Background Decorative Orbs */}
                <div className="bg-orb orb-1"></div>
                <div className="bg-orb orb-2"></div>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
