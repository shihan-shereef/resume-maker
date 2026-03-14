import React, { useState } from 'react';
import { Video, ShieldAlert, Cpu, Award } from 'lucide-react';
import PreInterviewSetup from '../components/interview/PreInterviewSetup';
import ActiveInterviewRoom from '../components/interview/ActiveInterviewRoom';
import PerformanceReport from '../components/interview/PerformanceReport';

const InterviewSimulatorPage = () => {
    // Current stage of the interview: 'SETUP', 'ACTIVE', 'REPORT'
    const [stage, setStage] = useState('SETUP');
    
    // Interview configuration from the setup phase
    const [interviewConfig, setInterviewConfig] = useState({
        resumeText: '',
        type: 'HR', // HR, Technical, Coding, Mixed
    });

    // Transcript array filled during 'ACTIVE'
    const [transcript, setTranscript] = useState([]);
    
    // Final score/report data filled after 'ACTIVE'
    const [reportData, setReportData] = useState(null);
    
    // Blob URL for video replay
    const [videoUrl, setVideoUrl] = useState(null);

    const handleStartInterview = (config) => {
        setInterviewConfig(config);
        setStage('ACTIVE');
    };

    const handleEndInterview = (finalTranscript, videoBlobUrl) => {
        setTranscript(finalTranscript);
        setVideoUrl(videoBlobUrl);
        setStage('REPORT');
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', gap: '32px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                    <Video size={16} /> Virtual Interview Environment
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    Takshila <span className="gradient-text">Interview Simulator</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Professional AI-driven mock interviews with behavioral analysis, coding tests, and direct feedback.
                </p>
            </header>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {stage === 'SETUP' && (
                    <PreInterviewSetup onStart={handleStartInterview} />
                )}
                
                {stage === 'ACTIVE' && (
                    <ActiveInterviewRoom 
                        config={interviewConfig} 
                        onEnd={handleEndInterview} 
                    />
                )}

                {stage === 'REPORT' && (
                    <PerformanceReport 
                        transcript={transcript} 
                        videoUrl={videoUrl} 
                        config={interviewConfig} 
                        onRestart={() => setStage('SETUP')}
                    />
                )}
            </div>
        </div>
    );
};

export default InterviewSimulatorPage;
