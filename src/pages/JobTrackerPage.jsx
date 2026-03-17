import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Filter, Calendar, MapPin, DollarSign, Clock, MoreVertical, Layout, List, CheckCircle2, ExternalLink, Trash2 } from 'lucide-react';

const JobTrackerPage = () => {
    const [view, setView] = useState('board'); // 'board' or 'list'
    const [jobs, setJobs] = useState([]);

    const addJob = (job) => setJobs([job, ...jobs]);
    const deleteJob = (id) => {
        if (window.confirm("Are you sure you want to withdraw or delete this job application?")) {
            setJobs(jobs.filter(j => j.id !== id));
            localStorage.setItem('tracked_jobs', JSON.stringify(jobs.filter(j => j.id !== id)));
        }
    };

    useEffect(() => {
        const storedJobs = JSON.parse(localStorage.getItem('tracked_jobs') || '[]');
        if (storedJobs.length === 0) {
            // Default mocks if empty
            const defaults = [
                { id: 1, company: 'Google', role: 'Senior UX Designer', status: 'Applied', date: '2026-03-10', location: 'Mountain View, CA', salary: '$180k - $220k' },
                { id: 2, company: 'Meta', role: 'Product Manager', status: 'Interviewing', date: '2026-03-08', location: 'Remote', salary: '$190k' }
            ];
            setJobs(defaults);
            localStorage.setItem('tracked_jobs', JSON.stringify(defaults));
        } else {
            setJobs(storedJobs);
        }
    }, []);

    const statuses = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '0.1em'
                    }}>
                        <Briefcase size={16} />
                        Pipeline Management
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                        Job <span className="gradient-text">Application Tracker</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Monitor your career progress and manage your application lifecycle.
                    </p>
                </div>
                <button className="btn-primary" style={{ padding: '0 24px', height: '56px', borderRadius: '16px' }}>
                    <Plus size={20} /> Add Target Job
                </button>
            </header>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="input-wrapper" style={{ width: '300px', marginBottom: 0 }}>
                        <Search size={18} className="input-icon" />
                        <input type="text" className="form-input" placeholder="Search company or role..." />
                    </div>
                    <button className="btn-secondary" style={{ padding: '12px' }}>
                        <Filter size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
                    <button 
                        onClick={() => setView('board')}
                        style={{ 
                            padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: view === 'board' ? 'white' : 'transparent',
                            color: view === 'board' ? 'var(--primary)' : 'var(--text-secondary)',
                            boxShadow: view === 'board' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        <Layout size={18} />
                    </button>
                    <button 
                        onClick={() => setView('list')}
                        style={{ 
                            padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: view === 'list' ? 'white' : 'transparent',
                            color: view === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
                            boxShadow: view === 'list' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {view === 'board' ? (
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                    {statuses.map(status => (
                        <div key={status} style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 
                                        status === 'Offer' ? '#10b981' : 
                                        status === 'Rejected' ? '#ef4444' : 
                                        status === 'Interviewing' ? 'var(--primary)' : '#94a3b8' 
                                    }}></div>
                                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{status}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                                        {jobs.filter(j => j.status === status).length}
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {jobs.filter(j => j.status === status).map(job => (
                                    <div key={job.id} className="glass-card" style={{ padding: '20px', background: 'white', border: 'none' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{job.company}</div>
                                            <MoreVertical size={16} color="var(--text-tertiary)" />
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>{job.role}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                <MapPin size={14} /> {job.location}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                <Calendar size={14} /> {job.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button style={{ 
                                    padding: '12px', 
                                    borderRadius: '12px', 
                                    border: '1px dashed #cbd5e1', 
                                    background: 'transparent', 
                                    color: 'var(--text-tertiary)', 
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}>
                                    + Add Job
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '0', background: 'white', border: 'none', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Company</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Role</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Location</th>
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Salary</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '20px 24px', fontWeight: 700 }}>{job.company}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontWeight: 600 }}>{job.role}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '100px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 700,
                                            background: job.status === 'Offer' ? '#ecfdf5' : job.status === 'Rejected' ? '#fef2f2' : '#eff6ff',
                                            color: job.status === 'Offer' ? '#10b981' : job.status === 'Rejected' ? '#ef4444' : '#3b82f6'
                                        }}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{job.location}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{job.salary}</td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <MoreVertical size={16} color="var(--text-tertiary)" style={{ cursor: 'pointer' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default JobTrackerPage;
