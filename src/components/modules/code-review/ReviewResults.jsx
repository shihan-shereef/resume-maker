import React, { useState } from 'react';
import { Bug, Sparkles, BookOpen, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info, Terminal, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom diff viewer — replaces react-diff-viewer-next (incompatible with React 19)
const SimpleDiffViewer = ({ oldValue, newValue }) => {
    const oldLines = (oldValue || '').split('\n');
    const newLines = (newValue || '').split('\n');
    const maxLen = Math.max(oldLines.length, newLines.length);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", borderRadius: '10px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
            <div style={{ background: '#fef2f2', borderRight: '1px solid #fecaca' }}>
                <div style={{ padding: '6px 12px', background: '#fee2e2', fontWeight: 800, fontSize: '0.7rem', color: '#b91c1c', textTransform: 'uppercase' }}>Before</div>
                {oldLines.map((line, i) => (
                    <div key={i} style={{ padding: '2px 12px', color: '#7f1d1d', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: line !== (newLines[i] || '') ? 'rgba(239,68,68,0.1)' : 'transparent' }}>{line || ' '}</div>
                ))}
            </div>
            <div style={{ background: '#f0fdf4' }}>
                <div style={{ padding: '6px 12px', background: '#dcfce7', fontWeight: 800, fontSize: '0.7rem', color: '#15803d', textTransform: 'uppercase' }}>After</div>
                {newLines.map((line, i) => (
                    <div key={i} style={{ padding: '2px 12px', color: '#14532d', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: line !== (oldLines[i] || '') ? 'rgba(34,197,94,0.1)' : 'transparent' }}>{line || ' '}</div>
                ))}
            </div>
        </div>
    );
};

const ReviewResults = ({ data }) => {
    const [activeTab, setActiveTab] = useState('findings'); // findings, documentation
    const [expandedFinding, setExpandedFinding] = useState(null);

    const findings = data.findings || [];
    const bugs = findings.filter(f => f.category === 'bug');
    const improvements = findings.filter(f => f.category === 'improvement');

    return (
        <div className="glass-card" style={{ padding: '0', background: 'white', border: 'none', overflow: 'hidden' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', background: '#f8fafc' }}>
                <button 
                    onClick={() => setActiveTab('findings')}
                    style={{ 
                        flex: 1, padding: '20px', border: 'none', background: activeTab === 'findings' ? 'white' : 'transparent', 
                        fontWeight: 800, color: activeTab === 'findings' ? 'var(--primary)' : '#64748b', 
                        borderBottom: activeTab === 'findings' ? '3px solid var(--primary)' : 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    <Bug size={18} /> Findings ({findings.length})
                </button>
                <button 
                    onClick={() => setActiveTab('documentation')}
                    style={{ 
                        flex: 1, padding: '20px', border: 'none', background: activeTab === 'documentation' ? 'white' : 'transparent', 
                        fontWeight: 800, color: activeTab === 'documentation' ? 'var(--primary)' : '#64748b', 
                        borderBottom: activeTab === 'documentation' ? '3px solid var(--primary)' : 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    <BookOpen size={18} /> AI Documentation
                </button>
            </div>

            <div style={{ padding: '32px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'findings' && (
                        <motion.div 
                            key="findings"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            {findings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                    <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No issues found!</p>
                                    <p>Your code is already in great shape.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Bugs Section */}
                                    {bugs.length > 0 && (
                                        <section>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <AlertCircle size={18} /> Bugs & Vulnerabilities ({bugs.length})
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {bugs.map((bug, i) => (
                                                    <FindingItem 
                                                        key={`bug-${i}`} 
                                                        finding={bug} 
                                                        isExpanded={expandedFinding === `bug-${i}`}
                                                        onToggle={() => setExpandedFinding(expandedFinding === `bug-${i}` ? null : `bug-${i}`)}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Improvements Section */}
                                    {improvements.length > 0 && (
                                        <section>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Sparkles size={18} /> Suggested Improvements ({improvements.length})
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {improvements.map((improvement, i) => (
                                                    <FindingItem 
                                                        key={`imp-${i}`} 
                                                        finding={improvement} 
                                                        isExpanded={expandedFinding === `imp-${i}`}
                                                        onToggle={() => setExpandedFinding(expandedFinding === `imp-${i}` ? null : `imp-${i}`)}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'documentation' && (
                        <motion.div 
                            key="docs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="documentation-view"
                            style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}
                        >
                            {data.documentation ? (
                                <div dangerouslySetInnerHTML={{ __html: data.documentation.replace(/\n/g, '<br/>') }} />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                    <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                    <p>No documentation generated for this codebase.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const FindingItem = ({ finding, isExpanded, onToggle }) => {
    const severityColor = finding.severity === 'high' ? '#ef4444' : finding.severity === 'medium' ? '#f59e0b' : '#3b82f6';
    const bgColor = finding.severity === 'high' ? '#fef2f2' : finding.severity === 'medium' ? '#fffbeb' : '#eff6ff';

    return (
        <div 
            style={{ 
                border: `1px solid ${bgColor === '#fef2f2' ? '#fecaca' : bgColor === '#fffbeb' ? '#fde68a' : '#bfdbfe'}`, 
                borderRadius: '16px', overflow: 'hidden', background: isExpanded ? 'white' : bgColor,
                transition: '0.3s'
            }}
        >
            <div 
                onClick={onToggle}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
                <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: severityColor,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    {finding.category === 'bug' ? <Bug size={16} /> : <Sparkles size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{finding.description}</span>
                        <span style={{ 
                            fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', 
                            padding: '2px 8px', borderRadius: '100px', background: severityColor, color: 'white'
                        }}>
                            {finding.severity}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        {finding.file_path} : Line {finding.line_number}
                    </div>
                </div>
                {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ borderTop: '1px solid #f1f5f9', background: 'white', padding: '24px' }}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={16} color="var(--primary)" /> Suggested Fix
                            </h4>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #eef2f6', color: '#475569', fontSize: '0.9rem' }}>
                                {finding.suggested_fix}
                            </div>
                        </div>

                        {finding.code_snippet && finding.suggested_fix && (
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Terminal size={16} color="var(--primary)" /> Before vs After
                                </h4>
                                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eef2f6', fontSize: '0.8rem' }}>
                                <SimpleDiffViewer 
                                        oldValue={finding.code_snippet} 
                                        newValue={finding.suggested_fix.includes('\n') ? finding.suggested_fix : finding.code_snippet.replace(finding.code_snippet.trim(), finding.suggested_fix)} 
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReviewResults;
