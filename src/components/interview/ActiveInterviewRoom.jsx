import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { Mic, MicOff, AlertTriangle, Clock, Activity, StopCircle, Code2, Settings as SettingsIcon, Volume2 } from 'lucide-react';
import { generateResumeContent } from '../../lib/openrouter';
import { textToSpeech, VOICES, VOICE_PRESETS } from '../../lib/elevenlabs';
import { useResume } from '../../context/ResumeContext';
import CodingEnvironment from './CodingEnvironment';
import { cleanInterviewReply, isLikelyDuplicate, normalizeDialogueText } from '../../lib/dialogue';

const INTERVIEW_FALLBACK_QUESTIONS = {
    HR: [
        "Tell me about a time you had to adapt quickly to a change at work or school.",
        "What kind of team environment helps you do your best work?",
        "Describe a challenge you faced recently and how you handled it.",
        "What motivates you most in the roles you are applying for?",
    ],
    Technical: [
        "Can you walk me through a project where you made an important technical decision?",
        "How do you usually debug an issue when you do not know the root cause yet?",
        "Tell me about a time you improved performance, reliability, or maintainability in a system.",
        "How do you decide between shipping quickly and improving code quality?",
    ],
    Coding: [
        "Explain your approach before you start coding so I can follow your reasoning.",
        "How would you test your solution once the main logic is in place?",
        "What edge cases would you check first for this kind of problem?",
        "If your first approach felt too slow, how would you optimize it?",
    ],
    Mixed: [
        "Start by telling me about a project you are proud of and why it mattered.",
        "How do you balance collaboration, delivery speed, and technical quality?",
        "What kind of problems do you most enjoy solving?",
        "Describe a time you had to explain something complex in a simple way.",
    ],
};

const ActiveInterviewRoom = ({ config, onEnd }) => {
    const { resumeData } = useResume();
    const userName = resumeData.personalInfo.firstName || "Candidate";
    
    // Media & Vision Refs
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [recordedChunks, setRecordedChunks] = useState([]); // Keep state if needed for UI, but use ref for blob
    
    // Core states
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [aiSubtitle, setAiSubtitle] = useState("Initializing interview environment...");
    const [userSubtitle, setUserSubtitle] = useState("");
    const [transcript, setTranscript] = useState([]);
    
    // Timer
    const [timeLeft, setTimeLeft] = useState(getInitialTime(config.type));
    
    // Anti-Cheat states
    const [warnings, setWarnings] = useState(0);
    const [currentWarning, setCurrentWarning] = useState("");
    const [model, setModel] = useState(null);
    const lastPosRef = useRef(null);
    const agitationScoreRef = useRef(0);
    
    // Voice & Emotions
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [detectedEmotion, setDetectedEmotion] = useState("Neutral");
    const [emotionConfidence, setEmotionConfidence] = useState(0);
    const recognitionRef = useRef(null);
    const lastSubmittedRef = useRef({ text: '', timestamp: 0 });
    const fallbackQuestionIndexRef = useRef(0);

    useEffect(() => {
        // Load ML Model
        cocoSsd.load().then(loadedModel => {
            setModel(loadedModel);
            startRecording();
            beginInterviewLoop();
        });

        // Setup Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                if (interimTranscript) setUserSubtitle(interimTranscript);
                if (finalTranscript) {
                    setUserSubtitle(finalTranscript);
                    handleUserSubmit(finalTranscript);
                }
            };
            
            recognitionRef.current.onend = () => {
                setIsListening(false);
                // The submit logic triggers in onresult final.
            };
        }

        // Fetch Voices
        const loadVoices = () => {
             const voices = window.speechSynthesis.getVoices();
             if (voices.length > 0) {
                 const enVoices = voices.filter(v => v.lang.startsWith('en'));
                 setAvailableVoices(enVoices);
                 // Default to a premium voice if possible (Siri, Daniel, etc.)
                 const premium = enVoices.find(v => v.name.includes('Siri') || v.name.includes('Natural'));
                 setSelectedVoice(premium || enVoices[0]);
             }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1) { clearInterval(timer); stopInterview(); return 0; }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    // ML Detection Loop
    useEffect(() => {
        if (!model) return;
        const interval = setInterval(async () => {
             if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                 const predictions = await model.detect(webcamRef.current.video);
                                  let phoneDetected = false;
                  let personCount = 0;
                  let personBox = null;
                  
                  predictions.forEach(p => {
                      if (p.class === 'cell phone') phoneDetected = true;
                      if (p.class === 'person') {
                          personCount++;
                          personBox = p.bbox; // [x, y, width, height]
                      }
                  });

                  // Simple Agitation (Nervousness) Detection
                  if (personBox) {
                      if (lastPosRef.current) {
                          const dx = Math.abs(personBox[0] - lastPosRef.current[0]);
                          const dy = Math.abs(personBox[1] - lastPosRef.current[1]);
                          const movement = dx + dy;
                          
                          if (movement > 15) { // Threshold for "shaky" or rapid movement
                              agitationScoreRef.current += 1;
                          } else {
                              agitationScoreRef.current = Math.max(0, agitationScoreRef.current - 0.5);
                          }

                          if (agitationScoreRef.current > 5) {
                              setDetectedEmotion("Nervous");
                          } else {
                              setDetectedEmotion("Neutral/Calm");
                          }
                      }
                      lastPosRef.current = personBox;
                  }

                  if (phoneDetected) issueWarning("Phone usage detected. Please put the device away.");
                 if (personCount > 1) issueWarning("Multiple people detected in frame.");
                 if (personCount === 0) issueWarning("You are not visible in the camera frame.");
             }
        }, 2000);
        return () => clearInterval(interval);
    }, [model]);

    const issueWarning = (msg) => {
        setCurrentWarning(msg);
        setWarnings(w => {
            const newW = w + 1;
            if (newW >= 3) {
                stopInterview(true); // Terminate
            }
            return newW;
        });
        setTimeout(() => setCurrentWarning(""), 4000);
    };

    function getInitialTime(type) {
        if (type === 'HR') return 15 * 60;
        if (type === 'Technical') return 30 * 60;
        if (type === 'Coding') return 45 * 60;
        return 40 * 60;
    }

    const startRecording = () => {
        if (webcamRef.current && webcamRef.current.stream) {
            const types = ["video/webm", "video/mp4", "video/ogg"];
            const supportedType = types.find(type => MediaRecorder.isTypeSupported(type));
            
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: supportedType || ""
            });
            mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
            mediaRecorderRef.current.start(1000); // Capture data every second
        }
    };

    const handleDataAvailable = useCallback(({ data }) => {
        if (data.size > 0) {
            chunksRef.current.push(data);
            setRecordedChunks((prev) => prev.concat(data));
        }
    }, []);

    const beginInterviewLoop = async () => {
        setIsThinking(true);
        const isResumeProvided = config.resumeText && !config.resumeText.includes("No resume provided");
        
        const duration = config.type === 'Technical' ? '25-30' : config.type === 'Behavioral' ? '10-15' : '15-20';
        
        const systemPrompt = `You are Taylor, an expert AI Interviewer at Takshila.
Candidate Name: ${userName}
Expected Interview Duration: ${duration} minutes

Rules:
1. ALWAYS address the candidate as "${userName}" in your first message and occasionally throughout.
2. Start by introducing yourself and mentioning that this interview will take approximately 15-20 minutes.
3. Be professional, encouraging, and human-like.
4. Ask one question at a time.
5. Evaluate the candidate's technical and soft skills based on their resume and the job description.
6. If the candidate asks for feedback, give brief, constructive points.
7. Do not repeat any sentence, greeting, or question.
${isResumeProvided 
            ? `CONTEXT: Use the following resume data to tailor your questions: ${config.resumeText.substring(0, 3000)}` 
            : `CONTEXT: No resume was provided. Ask a general high-quality introductory question based on a ${config.type} interview path.`}
        - Keep your response UNDER 3 sentences.
        - Ask exactly one fresh opening question.
        - NEVER use asterisks or actions (e.g., *nods*).
        - DO NOT say "As an AI...". Simply speak.
        - Be warm but professional.`;
        
        try {
            const firstQuestion = await generateResumeContent(systemPrompt, "You are a realistic AI interviewer.", "openai/gpt-4o-mini");
            const cleanedFirstQuestion = cleanInterviewReply(firstQuestion) || getFallbackInterviewQuestion(config.type, []);
            speakAndContinue(cleanedFirstQuestion, 'ai');
        } catch(e) {
            console.error(e);
            speakAndContinue(getFallbackInterviewQuestion(config.type, []), 'ai');
        }
    };

    const getFallbackInterviewQuestion = (type, transcriptSnapshot) => {
        const options = INTERVIEW_FALLBACK_QUESTIONS[type] || INTERVIEW_FALLBACK_QUESTIONS.Mixed;
        const priorAiTurns = transcriptSnapshot
            .filter((entry) => entry.role === 'ai')
            .map((entry) => entry.content);

        const nextUnique = options.find((question) => !priorAiTurns.some((previous) => isLikelyDuplicate(previous, question)));
        const fallback = nextUnique || options[fallbackQuestionIndexRef.current % options.length];
        fallbackQuestionIndexRef.current += 1;
        return fallback;
    };

    const speakAndContinue = async (text, role) => {
        setIsThinking(false);
        const cleanedText = role === 'ai' ? cleanInterviewReply(text) : text;
        setAiSubtitle(cleanedText);
        
        // Append to transcript
        setTranscript(prev => [...prev, { role, content: cleanedText }]);

        window.speechSynthesis.cancel();
        
        try {
            // Try ElevenLabs first if key exists
            const ttsUrl = await textToSpeech(cleanedText, VOICES.INTERVIEWER, VOICE_PRESETS.INTERVIEWER);
            
            if (ttsUrl) {
                const audio = new Audio(ttsUrl);
                audio.onended = () => {
                    setTimeout(() => {
                        setUserSubtitle("Listening...");
                        setIsListening(true);
                        if(recognitionRef.current) {
                            try { recognitionRef.current.start(); } catch {}
                        }
                    }, 500);
                };
                audio.play().catch(() => {
                    console.warn("ElevenLabs Playback failed, falling back to system voice.");
                    fallbackSpeak(cleanedText);
                });
                return;
            }
        } catch (err) {
            console.error("TTS Error:", err);
        }

        fallbackSpeak(cleanedText);
    };

    const fallbackSpeak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.onend = () => {
            // After AI finishes speaking, open the mic for the user
            setTimeout(() => {
                setUserSubtitle("Listening...");
                setIsListening(true);
                if(recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch {}
                }
            }, 500);
        };
        
        window.speechSynthesis.speak(utterance);
    };

    const handleUserSubmit = async (userText) => {
        const normalizedUserText = normalizeDialogueText(userText);
        const now = Date.now();

        if (!normalizedUserText) {
            return;
        }

        if (
            lastSubmittedRef.current.text === normalizedUserText &&
            now - lastSubmittedRef.current.timestamp < 4000
        ) {
            return;
        }

        lastSubmittedRef.current = { text: normalizedUserText, timestamp: now };

        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        setIsThinking(true);
        
        const newTranscript = [...transcript, { role: 'user', content: userText }];
        setTranscript(newTranscript);
        setUserSubtitle("");

        // Construct history for AI follow-up
        const historyText = newTranscript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n');

        const prompt = `You are the ${config.type} Interviewer.
        HISTORY: ${historyText}
        EMOTION_DETECTED: ${detectedEmotion}
        RECENT_INTERVIEWER_MESSAGES: ${newTranscript.filter((entry) => entry.role === 'ai').slice(-2).map((entry) => entry.content).join(' | ') || 'None yet'}
        
        The candidate just answered. Speak like a real person. 
        If they seem nervous (${detectedEmotion}), acknowledge it warmly (e.g., "Take your time, no rush").
        Respond with your NEXT question or a brief follow-up. 
        
        CONVERSATIONAL RULES:
        - Be direct and human. Avoid generic AI praise like "That is a great answer."
        - Keep it strictly UNDER 3 sentences.
        - Ask a new question that is materially different from your recent interviewer messages.
        - Do not repeat or paraphrase any earlier question.
        - Do not repeat a sentence within the same reply.
        - Do not restate the candidate's last answer unless you are asking for one precise clarification.
        - Only output what you literally say. No markdown.`;

        try {
             const recentAiTurns = newTranscript.filter((entry) => entry.role === 'ai').slice(-2).map((entry) => entry.content);
             let nextResponse = cleanInterviewReply(
                 await generateResumeContent(prompt, "You are a realistic AI interviewer.", "openai/gpt-4o-mini")
             );

             if (!nextResponse || recentAiTurns.some((previous) => isLikelyDuplicate(previous, nextResponse))) {
                 const retryPrompt = `${prompt}

IMPORTANT:
- Your previous draft repeated a recent interviewer message.
- Ask one clearly different follow-up question right now.
- No repeated phrasing.`;

                 nextResponse = cleanInterviewReply(
                     await generateResumeContent(retryPrompt, "You are a realistic AI interviewer.", "openai/gpt-4o-mini")
                 );
             }

             if (!nextResponse || recentAiTurns.some((previous) => isLikelyDuplicate(previous, nextResponse))) {
                 nextResponse = getFallbackInterviewQuestion(config.type, newTranscript);
             }

             speakAndContinue(nextResponse, 'ai');
        } catch (e) {
             speakAndContinue(getFallbackInterviewQuestion(config.type, newTranscript), 'ai');
        }
    };

    const stopInterview = (disqualified = false) => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        window.speechSynthesis.cancel();
        if (recognitionRef.current) recognitionRef.current.stop();
        
        setTimeout(() => {
             const blob = new Blob(chunksRef.current, { type: "video/webm" });
             const url = URL.createObjectURL(blob);
             
             const finalData = [...transcript];
             if(disqualified) {
                 finalData.push({ role: 'system', content: 'INTERVIEW TERMINATED DUE TO CHEATING INFRACTIONS.' });
             }
             
             onEnd(finalData, url);
        }, 1200);
    };

    const handleCodeSubmission = (systemMsg) => {
        handleUserSubmit(systemMsg);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const isCodingMode = config.type === 'Coding' || config.type === 'Technical';

    return (
        <div style={{ display: 'grid', gridTemplateColumns: isCodingMode ? '400px minmax(0, 1fr) 280px' : 'minmax(0, 1fr) 300px', gap: '24px', flex: 1 }}>
            
            {/* Left Column: Visuals & Subtitles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                
                {/* Main Video Area */}
                <div style={{ 
                    flex: 1, 
                    background: '#0f172a', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}>
                    {/* The AI Avatar / Visualization (Placeholder) */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
                         <div style={{ 
                             width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                             boxShadow: isThinking ? '0 0 40px rgba(255,140,0,0.4)' : (isListening ? '0 0 20px rgba(59,130,246,0)' : '0 0 60px rgba(16,185,129,0.3)'),
                             transition: 'all 0.5s ease'
                         }}>
                             <Activity size={80} color={isThinking ? "#f59e0b" : "#10b981"} className={isThinking ? "animate-pulse" : ""} />
                         </div>
                    </div>

                    {/* Picture in Picture Webcam */}
                    <div style={{ position: 'absolute', top: '24px', right: '24px', width: '200px', height: '150px', borderRadius: '16px', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                        <Webcam 
                            audio={true} 
                            ref={webcamRef} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                            muted={true}
                        />
                        {/* Emotion Tag */}
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: detectedEmotion === 'Nervous' ? '#ef4444' : '#10b981', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                            {detectedEmotion}
                        </div>
                    </div>
                    
                    {/* Warning Overlay */}
                    {currentWarning && (
                         <div className="animate-fade-in" style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, backdropFilter: 'blur(10px)', border: '1px solid #fca5a5' }}>
                             <AlertTriangle size={24} />
                             {currentWarning} ({warnings}/3 Strikes)
                         </div>
                    )}

                    {/* AI Subtitles */}
                    <div style={{ position: 'absolute', bottom: '120px', left: '0', right: '0', padding: '0 60px', textAlign: 'center' }}>
                         <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'white', padding: '16px 32px', borderRadius: '100px', fontSize: '1.25rem', fontWeight: 600, display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>
                             {isThinking ? "Hmm, analyzing..." : aiSubtitle}
                         </span>
                    </div>

                    {/* User Subtitles & Controls */}
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                         
                         {isListening && (
                             <div style={{ color: '#94a3b8', fontSize: '1.1rem', fontStyle: 'italic' }}>
                                 "{userSubtitle}"
                             </div>
                         )}

                         <div style={{ 
                             width: '80px', height: '80px', borderRadius: '50%', background: isListening ? '#ef4444' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)', transition: 'all 0.3s', cursor: isListening ? 'pointer' : 'default',
                             boxShadow: isListening ? '0 0 30px rgba(239,68,68,0.5)' : 'none'
                         }} onClick={() => {
                             if(isListening && recognitionRef.current) recognitionRef.current.stop();
                         }}>
                             {isListening ? <Mic size={32} color="white" className="animate-pulse" /> : <MicOff size={32} color="#64748b" />}
                         </div>
                         <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                             {isListening ? 'Listening (Click to send early)' : 'Wait for your turn'}
                         </div>
                     </div>
                </div>
            </div>

            {/* Middle Column: Coding Environment (Optional) */}
            {isCodingMode && (
                <CodingEnvironment onCodeSubmit={handleCodeSubmission} />
            )}

            {/* Right Column: Status & Timer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="glass-card" style={{ padding: '32px', background: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Time Remaining</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, color: timeLeft < 300 ? '#ef4444' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontFamily: 'monospace' }}>
                        <Clock size={32} /> {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '32px', background: 'white', flex: 1, position: 'relative' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Session Details</h3>
                        <button 
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                        >
                            <SettingsIcon size={20} />
                        </button>
                     </div>

                     {isSettingsOpen && (
                        <div style={{ position: 'absolute', top: '70px', right: '32px', left: '32px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zgeIndex: 50 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Interviewer Voice</div>
                            <select 
                                value={selectedVoice?.name || ''}
                                onChange={(e) => setSelectedVoice(availableVoices.find(v => v.name === e.target.value))}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                            >
                                {availableVoices.map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                            <button 
                                onClick={() => setIsSettingsOpen(false)}
                                className="btn-primary" 
                                style={{ width: '100%', height: '36px', marginTop: '12px', fontSize: '0.8rem' }}
                            >Done</button>
                        </div>
                     )}

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                             <span style={{ color: '#64748b', fontWeight: 600 }}>Type</span>
                             <span style={{ fontWeight: 800, color: '#0f172a' }}>{config.type}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                             <span style={{ color: '#64748b', fontWeight: 600 }}>Mood (EQ)</span>
                             <span style={{ fontWeight: 800, color: detectedEmotion === 'Nervous' ? '#ef4444' : '#10b981' }}>{detectedEmotion}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                             <span style={{ color: '#64748b', fontWeight: 600 }}>Status</span>
                             <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Recording 🔴</span>
                         </div>
                     </div>

                     <button 
                         onClick={() => stopInterview(false)}
                         style={{ width: '100%', height: '56px', borderRadius: '16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 800, fontSize: '1rem', marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
                     >
                         <StopCircle size={20} /> End Interview Early
                     </button>
                </div>
            </div>

        </div>
    );
};

export default ActiveInterviewRoom;
