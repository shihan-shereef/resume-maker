import React from 'react';
import { ArrowLeft, Download, RotateCcw, Share2, Calendar, Layout, FileCode } from 'lucide-react';

const ReviewHeader = ({ data, onBack }) => {
    const scoreColor = data.score >= 80 ? '#10b981' : data.score >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="glass-card" style={{ padding: '32px', background: 'white', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        border: `8px solid ${scoreColor}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <circle 
                                cx="40" cy="40" r="36" 
                                fill="none" stroke="#f1f5f9" strokeWidth="8"
                            />
                            <circle 
                                cx="40" cy="40" r="36" 
                                fill="none" stroke={scoreColor} strokeWidth="8"
                                strokeDasharray={2 * Math.PI * 36}
                                strokeDashoffset={2 * Math.PI * 36 * (1 - data.score / 100)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                            />
                        </svg>
                        <div style={{ 
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            fontSize: '1.25rem', fontWeight: 900, color: scoreColor
                        }}>
                            {data.score}
                        </div>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>{data.repo_name || 'Code Review'}</h2>
                        <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileCode size={16} /> {data.language || 'Detected'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onBack} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                        <RotateCcw size={16} /> New Review
                    </button>
                    <button onClick={() => window.print()} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {data.findings.filter(f => f.severity === 'high').length > 0 && (
                    <span style={{ background: '#fef2f2', color: '#ef4444', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #fee2e2' }}>
                        {data.findings.filter(f => f.severity === 'high').length} Critical Issues
                    </span>
                )}
                <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #e0f2fe' }}>
                    {data.findings.length} Total Findings
                </span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #dcfce7' }}>
                    AI Analysis Completed
                </span>
            </div>
        </div>
    );
};

export default ReviewHeader;
