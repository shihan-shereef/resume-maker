import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeMaker from './pages/ResumeMaker';
import AtsCheckerPage from './pages/AtsCheckerPage';
import JobSearchPage from './pages/JobSearchPage';
import NotesPage from './pages/NotesPage';
import YoutubeSummarizerAdvanced from './pages/YoutubeSummarizerAdvanced';
import RoadmapGenerator from './pages/RoadmapGenerator';
import InterviewSimulatorPage from './pages/InterviewSimulatorPage';
import SettingsPage from './pages/SettingsPage';
import CoverLetterPage from './pages/CoverLetterPage';
import PdfSummarizerPage from './pages/PdfSummarizerPage';
import SkillGapPage from './pages/SkillGapPage';
import JobTrackerPage from './pages/JobTrackerPage';
import PortfolioPage from './pages/PortfolioPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import WorkspaceLayout from './components/layout/WorkspaceLayout';
// Placeholder components for modules
const Placeholder = ({ title }) => (
    <div className="glass-card" style={{ padding: '60px', textAlign: 'center', background: 'white' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>This module is currently under development at Takshila.</p>
    </div>
);

import SplashScreen from './components/common/SplashScreen';
import ErrorPage from './components/common/ErrorPage';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (loading) return null;

    if (isOffline) {
        return <ErrorPage type="offline" />;
    }

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage session={session} />} />
                <Route path="/login" element={session ? <Navigate to="/portfolio" /> : <Login />} />
                
                {/* Protected Workspace Routes */}
                <Route path="/dashboard" element={session ? <WorkspaceLayout><Dashboard /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/resume" element={session ? <WorkspaceLayout><ResumeMaker /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/ats" element={session ? <WorkspaceLayout><AtsCheckerPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                
                <Route path="/cover-letter" element={session ? <WorkspaceLayout><CoverLetterPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/skill-gap" element={session ? <WorkspaceLayout><SkillGapPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/roadmap" element={session ? <WorkspaceLayout><RoadmapGenerator /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/portfolio" element={session ? <WorkspaceLayout><PortfolioPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                
                <Route path="/job-search" element={session ? <WorkspaceLayout><JobSearchPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/tracker" element={session ? <WorkspaceLayout><JobTrackerPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/interview" element={session ? <WorkspaceLayout><InterviewSimulatorPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/youtube" element={session ? <WorkspaceLayout><YoutubeSummarizerAdvanced /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/pdf" element={session ? <WorkspaceLayout><PdfSummarizerPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/notes" element={session ? <WorkspaceLayout><NotesPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/file-tools" element={session ? <WorkspaceLayout><Placeholder title="File Tools" /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/ideas" element={session ? <WorkspaceLayout><Placeholder title="Project Ideas" /></WorkspaceLayout> : <Navigate to="/login" />} />
                <Route path="/settings" element={session ? <WorkspaceLayout><SettingsPage /></WorkspaceLayout> : <Navigate to="/login" />} />
                
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                
                <Route path="*" element={<ErrorPage type="404" />} />
            </Routes>
        </Router>
    );
}

export default App;
