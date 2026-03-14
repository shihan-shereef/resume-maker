import { Award, RefreshCcw, TrendingUp, CheckCircle, AlertCircle, PlayCircle, Download } from 'lucide-react';
import { generateResumeContent } from '../../lib/openrouter';
import LoadingMascot from '../common/LoadingMascot';

const PerformanceReport = ({ transcript, videoUrl, config, onRestart }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyzeTranscript();
    }, []);

    const analyzeTranscript = async () => {
        if (!transcript || transcript.length === 0) {
            setReport({
                overallScore: 0,
                communication: 0,
                technical: 0,
                confidence: 0,
                feedback: "Interview was too short to analyze.",
                pros: [],
                cons: []
            });
            setLoading(false);
            return;
        }

        try {
            const transcriptText = transcript.map(t => `${t.role}: ${t.content}`).join('\n');
            const prompt = `You are an expert Interview Coach.
            Analyze this interview transcript for a ${config.type} role.
            
            TRANSCRIPT:
            ${transcriptText.substring(0, 4000)}
            
            Evaluate the user based on their answers to the AI.
            Respond ONLY with a valid JSON object matching exactly this structure:
            {
                "overallScore": 85,
                "communication": 80,
                "technical": 90,
                "confidence": 85,
                "feedback": "A short 2 sentence overall summary.",
                "pros": ["Clear explanation of X", "Good pacing"],
                "cons": ["Stumbled on question Y", "Too brief on Z"]
            }`;

            const responseText = await generateResumeContent(prompt, "You are a JSON returning AI.", "openai/gpt-4o-mini");
            
            // Try parsing JSON out of markdown if necessary
            let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);
            
            setReport(data);

        } catch (e) {
            console.error('Failed to analyze', e);
            setReport({
                overallScore: '...',
                communication: '...',
                technical: '...',
                confidence: '...',
                feedback: "Failed to generate AI analysis reliably.",
                pros: ["Completed the interview"],
                cons: ["Analysis engine error"]
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                <LoadingMascot message="Analyzing your answers and generating performance report..." />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
            
            {/* Left Column: Report Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Score Header */}
                <div className="glass-card" style={{ padding: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: '40px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `8px solid ${report.overallScore > 75 ? '#10b981' : (report.overallScore > 50 ? '#f59e0b' : '#ef4444')}`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{report.overallScore}</div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Score</div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Interview Complete</h2>
                        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                            {report.feedback}
                        </p>
                    </div>

                </div>

                {/* Detailed Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Communication</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{report.communication}/100</div>
                    </div>
                    <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Technical Focus</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{report.technical}/100</div>
                    </div>
                    <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Confidence</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{report.confidence}/100</div>
                    </div>
                </div>

                {/* Pros and Cons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle color="#10b981" /> Strengths
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0, listStyle: 'none' }}>
                            {report.pros.map((pro, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#334155', fontSize: '1.05rem', lineHeight: 1.5 }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginTop: '8px', flexShrink: 0 }} />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle color="#f59e0b" /> Areas to Improve
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0, listStyle: 'none' }}>
                            {report.cons.map((con, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#334155', fontSize: '1.05rem', lineHeight: 1.5 }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginTop: '8px', flexShrink: 0 }} />
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>

            {/* Right Column: Video Playback & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlayCircle size={20} color="var(--primary)" /> Session Replay
                    </h3>
                    
                    {videoUrl ? (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                             <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0f172a', border: '1px solid #e2e8f0' }}>
                                 <video src={videoUrl} controls style={{ width: '100%', display: 'block' }}></video>
                             </div>
                             <button 
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = videoUrl;
                                    link.download = `interview_recording_${new Date().getTime()}.webm`;
                                    link.click();
                                }}
                                className="btn-secondary" 
                                style={{ width: '100%', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
                             >
                                <Download size={18} /> Download My Recording
                             </button>
                         </div>
                    ) : (
                         <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8', fontSize: '0.9rem' }}>
                             Video not available. (Perhaps the interview was cut short or camera permissions failed).
                         </div>
                    )}

                    <div style={{ marginTop: '24px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                        Review your body language, pacing, and eye contact. Recordings are stored locally on your device and are never uploaded to any server.
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>Next Steps</h3>
                    <button 
                        onClick={onRestart}
                        className="btn-primary" 
                        style={{ width: '100%', height: '56px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem' }}
                    >
                        <RefreshCcw size={18} /> Practice Again
                    </button>
                    <button 
                        className="btn-secondary" 
                        style={{ width: '100%', height: '56px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.05rem', marginTop: '16px' }}
                    >
                        Review Full Transcript
                    </button>
                </div>

            </div>

        </div>
    );
};

export default PerformanceReport;
