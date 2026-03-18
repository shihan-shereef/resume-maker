import React, { useState, useRef } from 'react';
import { Upload, Camera, Mic, Settings, UserCheck, Code, Briefcase, ChevronRight, FileText, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import LoadingMascot from '../common/LoadingMascot';
import { extractResumeText } from '../../lib/pdfjs';

const PreInterviewSetup = ({ onStart }) => {
    const [fileStats, setFileStats] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [interviewType, setInterviewType] = useState('HR');
    const [hardwareStatus, setHardwareStatus] = useState({ cam: false, mic: false });
    const [isParsing, setIsParsing] = useState(false);
    const [showManualPaste, setShowManualPaste] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const interviewTypes = [
        { id: 'HR', label: 'HR & Behavioral', icon: <UserCheck size={24}/>, desc: 'Focus on teamwork, leadership, and cultural fit. (15 mins)' },
        { id: 'Technical', label: 'Technical Details', icon: <Cpu size={24}/>, desc: 'Deep dive into your core technical skills and tools. (30 mins)' },
        { id: 'Coding', label: 'Live Coding', icon: <Code size={24}/>, desc: 'Algorithmic problem solving with live environment. (45 mins)' },
        { id: 'Mixed', label: 'Full Loop (Mixed)', icon: <Briefcase size={24}/>, desc: 'Comprehensive HR, Technical, and Project review. (40 mins)' }
    ];

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError(null);
        setIsParsing(true);
        setFileStats({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' });

        try {
            const extractedText = await Promise.race([
                extractResumeText(file, { allowDocx: false, minLength: 20 }),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Resume analysis is taking longer than usual. Please try again or use 'Paste Manually'.")),
                        60000
                    )
                ),
            ]);

            setResumeText(extractedText);
        } catch (err) {
            console.error("Parsing error:", err);
            setError(err.message || "Failed to parse resume.");
            setResumeText('');
            setFileStats(null);
        } finally {
            setIsParsing(false);
            event.target.value = '';
        }
    };

    const requestHardwarePermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setHardwareStatus({ cam: true, mic: true });
            // Stop tracks immediately so the light turns off until the real interview
            stream.getTracks().forEach(track => track.stop());
        } catch {
            setError("Camera and Microphone access are required to start the interview.");
            setHardwareStatus({ cam: false, mic: false });
        }
    };

    const handleStart = () => {
        if (!hardwareStatus.cam || !hardwareStatus.mic) {
            setError("Please grant camera and microphone permissions first.");
            return;
        }
        
        // Resume is no longer mandatory, but we warn the user
        onStart({
            resumeText: resumeText || "No resume provided. Act as a general interviewer.",
            type: interviewType
        });
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '32px' }}>
            
            {/* Left Column: Configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* 1. Resume Upload */}
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</div>
                        Upload Your Resume
                        <button 
                            onClick={() => setShowManualPaste(!showManualPaste)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                            {showManualPaste ? "Back to Upload" : "Paste Manually Instead"}
                        </button>
                    </h2>
                    
                    {showManualPaste ? (
                        <textarea 
                            placeholder="Paste your resume text here..."
                            value={resumeText}
                            onChange={(e) => {
                                setResumeText(e.target.value);
                                setFileStats({ name: "Manual Paste", size: `${(e.target.value.length / 1024).toFixed(1)} KB` });
                            }}
                            style={{ width: '100%', minHeight: '220px', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                        />
                    ) : (
                        <div 
                            style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '40px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isParsing ? (
                                <LoadingMascot message="Duck is analyzing your resume..." />
                            ) : resumeText ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <CheckCircle2 size={48} color="#10b981" />
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{fileStats?.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{fileStats?.size} • Parsed Successfully</div>
                                    </div>
                                    <button className="btn-secondary" style={{ marginTop: '12px', padding: '6px 16px', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); setResumeText(''); setFileStats(null); }}>Remove</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                                    <Upload size={40} style={{ opacity: 0.5 }} />
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1e293b' }}>Click to upload PDF</div>
                                    <div style={{ fontSize: '0.9rem' }}>The AI will instantly extract your projects and experience.</div>
                                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}> (Optional - You can skip this) </div>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.txt" style={{ display: 'none' }} />
                        </div>
                    )}
                </div>

                {/* 2. Interview Type */}
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</div>
                        Select Interview Mode
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {interviewTypes.map(type => (
                            <div 
                                key={type.id}
                                onClick={() => setInterviewType(type.id)}
                                style={{
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: `2px solid ${interviewType === type.id ? 'var(--primary)' : '#e2e8f0'}`,
                                    background: interviewType === type.id ? 'rgba(255,92,0,0.05)' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ color: interviewType === type.id ? 'var(--primary)' : '#64748b' }}>{type.icon}</div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{type.label}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{type.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Column: Hardware & Start */}
            <div>
                <div className="glass-card" style={{ padding: '32px', background: 'white', position: 'sticky', top: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', color: '#0f172a' }}>Ready to Begin?</h2>
                    
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#334155' }}>
                                <FileText size={20} color={resumeText ? '#10b981' : '#94a3b8'}/> Resume Parsed
                            </div>
                            {resumeText ? <CheckCircle2 size={20} color="#10b981"/> : <AlertCircle size={20} color="#f59e0b"/>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#334155' }}>
                                <Camera size={20} color={hardwareStatus.cam ? '#10b981' : '#94a3b8'}/> Webcam Access
                            </div>
                            {hardwareStatus.cam ? <CheckCircle2 size={20} color="#10b981"/> : <button onClick={requestHardwarePermissions} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Allow</button>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#334155' }}>
                                <Mic size={20} color={hardwareStatus.mic ? '#10b981' : '#94a3b8'}/> Mic Access
                            </div>
                            {hardwareStatus.mic ? <CheckCircle2 size={20} color="#10b981"/> : <button onClick={requestHardwarePermissions} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Allow</button>}
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
                        By clicking "Enter Interview Room", you agree to automated recording and AI analysis of your video and audio for the duration of the mock session. Make sure you are in a quiet, well-lit environment.
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', height: '64px', borderRadius: '100px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
                        onClick={handleStart}
                    >
                        Enter Interview Room <ChevronRight size={20} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default PreInterviewSetup;
