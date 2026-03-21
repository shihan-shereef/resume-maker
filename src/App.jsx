import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import WorkspaceLayout from './components/layout/WorkspaceLayout';

// Shared UI Components
import PrivacyPolicyModal from './components/ui/PrivacyPolicyModal';
import { PrivacyProvider, usePrivacy } from './context/PrivacyContext';

// Placeholder components for modules
const Placeholder = ({ title }) => (
    <div className="glass-card" style={{ padding: '60px', textAlign: 'center', background: 'white' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>This module is currently under development at Takshila.</p>
    </div>
);

import SplashScreen from './components/common/SplashScreen';
import ErrorPage from './components/common/ErrorPage';
import ButtermaxEffects from './components/effects/ButtermaxEffects';

const AnimatedRoutes = ({ session, Placeholder }) => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Routes location={location} key={location.pathname}>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage session={session} />} />
                    <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <Login />} />
                    
                    {/* Protected Workspace Routes */}
                    <Route path="/dashboard" element={session?.user ? <WorkspaceLayout><Dashboard /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/resume" element={session?.user ? <WorkspaceLayout><ResumeMaker /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/ats-checker" element={session?.user ? <WorkspaceLayout><AtsCheckerPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    
                    <Route path="/cover-letter" element={session?.user ? <WorkspaceLayout><CoverLetterPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/skill-gap" element={session?.user ? <WorkspaceLayout><SkillGapPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/roadmap" element={session?.user ? <WorkspaceLayout><RoadmapGenerator /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/portfolio" element={session?.user ? <WorkspaceLayout><PortfolioPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    
                    <Route path="/job-search" element={session?.user ? <WorkspaceLayout><JobSearchPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/tracker" element={session?.user ? <WorkspaceLayout><JobTrackerPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/interview-simulator" element={session?.user ? <WorkspaceLayout><InterviewSimulatorPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/youtube" element={session?.user ? <WorkspaceLayout><YoutubeSummarizerAdvanced /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/pdf" element={session?.user ? <WorkspaceLayout><PdfSummarizerPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/notes" element={session?.user ? <WorkspaceLayout><NotesPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/file-tools" element={session?.user ? <WorkspaceLayout><Placeholder title="File Tools" /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/ideas" element={session?.user ? <WorkspaceLayout><Placeholder title="Project Ideas" /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    <Route path="/settings" element={session?.user ? <WorkspaceLayout><SettingsPage /></WorkspaceLayout> : <Navigate to="/login" replace />} />
                    
                    {/* Admin Route */}
                    <Route 
                        path="/admin" 
                        element={
                            session?.user?.email === 'admin@takshila.ai' ? (
                                <WorkspaceLayout><AdminDashboard /></WorkspaceLayout>
                            ) : (
                                <Navigate to="/dashboard" replace />
                            )
                        } 
                    />

                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    
                    <Route path="*" element={<ErrorPage type="404" />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

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
        <PrivacyProvider>
            <AppContent session={session} Placeholder={Placeholder} />
        </PrivacyProvider>
    );
}

function AppContent({ session, Placeholder }) {
    const { isModalOpen, isFirstTime, closePrivacyModal, acceptPrivacy } = usePrivacy();

    return (
        <ButtermaxEffects>
            <Router>
                <AnimatedRoutes session={session} Placeholder={Placeholder} />
                <PrivacyPolicyModal 
                    isOpen={isModalOpen} 
                    isFirstTime={isFirstTime}
                    onClose={closePrivacyModal}
                    onAccept={acceptPrivacy}
                />
            </Router>
        </ButtermaxEffects>
    );
}

export default App;
