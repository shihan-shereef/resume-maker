import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for code
import { Code, Play, CheckCircle2, TerminalSquare } from 'lucide-react';

const CodingEnvironment = ({ onCodeSubmit }) => {
    const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n  \n}\n');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const languages = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' },
        { id: 'cpp', label: 'C++' }
    ];

    const handleRunCode = () => {
        setIsRunning(true);
        setOutput('Executions are simulated in the mock environment.\nAnalyzing syntax and structure...');
        
        // Simulate execution delay
        setTimeout(() => {
            try {
                if (language === 'javascript') {
                    // Extremely safe mock eval for JS only in this limited scope. 
                    // In a real prod environment, use a Web Worker or Docker sandbox.
                    let result;
                    const safeEval = new Function(`
                        try {
                            ${code}
                            return typeof solve === 'function' ? solve() : 'Code executed. No return value.';
                        } catch(e) {
                            return e.toString();
                        }
                    `);
                    result = safeEval();
                    setOutput(`> ${result}`);
                } else {
                     setOutput(`> Compiled and ran ${language} successfully.\n(Mock runtime environment output)`);
                }
            } catch (e) {
                setOutput(`> Error: ${e.message}`);
            }
            setIsRunning(false);
            
            // Inform the AI that code was run
            if (onCodeSubmit) {
                 onCodeSubmit(`[SYSTEM: The user executed their ${language} code. Current code state:\n${code}\nOutput:\n${output}]`);
            }
        }, 1500);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e293b', borderRadius: '24px', overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            
            {/* Toolbar */}
            <div style={{ padding: '16px 24px', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Code size={18} color="var(--primary)" /> Live Editor
                    </div>
                    
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                    >
                        {languages.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                        onClick={handleRunCode}
                        disabled={isRunning}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: isRunning ? 'not-allowed' : 'pointer', opacity: isRunning ? 0.7 : 1 }}
                    >
                        <Play size={16} fill="white" /> {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                    <button 
                        onClick={() => onCodeSubmit(`[SYSTEM: The user submitted their final code for review.]\nCode:\n${code}`)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <CheckCircle2 size={16} /> Submit to AI
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '48px', background: '#0f172a', borderRight: '1px solid #334155', zIndex: 1 }} />
                <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={(code) => {
                        let grammar = Prism.languages.javascript;
                        if (language === 'python') grammar = Prism.languages.python;
                        if (language === 'java') grammar = Prism.languages.java;
                        if (language === 'cpp') grammar = Prism.languages.cpp;
                        return Prism.highlight(code, grammar, language);
                    }}
                    padding={24}
                    style={{
                        fontFamily: '"Fira Code", monospace',
                        fontSize: '15px',
                        minHeight: '100%',
                        color: '#f8fafc',
                        marginLeft: '48px' // offset for line numbers visual
                    }}
                    className="custom-scrollbar"
                />
            </div>

            {/* Terminal / Output */}
            <div style={{ height: '200px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TerminalSquare size={14} /> Console Output
                </div>
                <div style={{ flex: 1, padding: '16px', fontFamily: 'monospace', color: '#cbd5e1', fontSize: '14px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {output || 'Waiting for execution...'}
                </div>
            </div>

        </div>
    );
};

export default CodingEnvironment;
