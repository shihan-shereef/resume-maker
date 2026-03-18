import React, { useMemo, useState } from 'react';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Calendar,
    MapPin,
    DollarSign,
    Layout,
    List,
    Trash2,
    X,
    Pencil,
    Link as LinkIcon,
    ExternalLink,
    FileText,
} from 'lucide-react';
import { loadTrackedJobs, saveTrackedJobs, upsertTrackedJob } from '../lib/jobTracker';

const statuses = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const emptyForm = {
    id: null,
    company: '',
    role: '',
    status: 'Wishlist',
    date: new Date().toISOString().split('T')[0],
    location: '',
    salary: '',
    link: '',
    applyUrl: '',
    source: 'manual',
    appliedAt: null,
    deadlineAt: null,
    employmentType: '',
    workMode: '',
    notes: '',
};

const statusPillStyles = {
    Wishlist: { background: '#f8fafc', color: '#475569' },
    Applied: { background: '#eff6ff', color: '#2563eb' },
    Interviewing: { background: '#fff7ed', color: '#ea580c' },
    Offer: { background: '#ecfdf5', color: '#10b981' },
    Rejected: { background: '#fef2f2', color: '#ef4444' },
};

const JobTrackerPage = () => {
    const [view, setView] = useState('board');
    const [jobs, setJobs] = useState(() => loadTrackedJobs());
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);

    const filteredJobs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return jobs.filter((job) => {
            const matchesSearch =
                !query ||
                job.company.toLowerCase().includes(query) ||
                job.role.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [jobs, searchTerm, statusFilter]);

    const openCreateModal = (presetStatus = 'Wishlist') => {
        setFormData({
            ...emptyForm,
            status: presetStatus,
            date: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (job) => {
        setFormData({ ...job });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(emptyForm);
    };

    const persistJobs = (updatedJobs) => {
        setJobs(updatedJobs);
        saveTrackedJobs(updatedJobs);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to remove this job from your tracker?')) {
            return;
        }

        const updatedJobs = jobs.filter((job) => String(job.id) !== String(id));
        persistJobs(updatedJobs);
    };

    const handleStatusChange = (id, status) => {
        const updatedJobs = jobs.map((job) => (
            String(job.id) === String(id) ? { ...job, status } : job
        ));

        persistJobs(updatedJobs);
    };

    const handleInputChange = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.company.trim() || !formData.role.trim()) {
            return;
        }

        const updatedJobs = upsertTrackedJob({
            ...formData,
            id: formData.id || `${Date.now()}`,
            source: formData.source || 'manual',
        });

        setJobs(updatedJobs);
        closeModal();
    };

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => ['Wishlist', 'Applied', 'Interviewing'].includes(job.status)).length;
    const offerCount = jobs.filter((job) => job.status === 'Offer').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
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
                        Track every role, keep your notes in one place, and update progress as applications move.
                    </p>
                </div>
                <button
                    className="btn-primary"
                    style={{ padding: '0 24px', height: '56px', borderRadius: '16px' }}
                    onClick={() => openCreateModal()}
                >
                    <Plus size={20} /> Add Target Job
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Total Jobs</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px' }}>{totalJobs}</div>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Pipeline</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px' }}>{activeJobs}</div>
                </div>
                <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Offers</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px' }}>{offerCount}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                    <div className="input-wrapper" style={{ width: '300px', marginBottom: 0 }}>
                        <Search size={18} className="input-icon" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search company, role, or location..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative', minWidth: '200px' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <select
                            className="form-input"
                            style={{ paddingLeft: '42px', marginBottom: 0 }}
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value="All">All statuses</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
                    <button
                        onClick={() => setView('board')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
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
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            background: view === 'list' ? 'white' : 'transparent',
                            color: view === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
                            boxShadow: view === 'list' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="glass-card" style={{ padding: '56px 32px', background: 'white', border: 'none', textAlign: 'center' }}>
                    <Briefcase size={52} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>No tracked jobs yet</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px' }}>
                        Add roles manually here or apply from the Job Discovery page and they will show up automatically in this tracker.
                    </p>
                    <button className="btn-primary" onClick={() => openCreateModal()}>
                        <Plus size={18} /> Add your first job
                    </button>
                </div>
            ) : view === 'board' ? (
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                    {statuses.map((status) => {
                        const columnJobs = filteredJobs.filter((job) => job.status === status);

                        return (
                            <div key={status} style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusPillStyles[status].color }} />
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{status}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{columnJobs.length}</span>
                                    </div>
                                    <button
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}
                                        onClick={() => openCreateModal(status)}
                                    >
                                        + Add
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {columnJobs.map((job) => (
                                        <div key={job.id} className="glass-card" style={{ padding: '20px', background: 'white', border: 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{job.company}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginTop: '4px' }}>{job.role}</div>
                                                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {job.source && (
                                                            <span style={{ padding: '5px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, background: job.source === 'search-confirmed' ? 'rgba(16, 185, 129, 0.08)' : '#f8fafc', color: job.source === 'search-confirmed' ? '#047857' : '#475569' }}>
                                                                {job.source === 'search-confirmed' ? 'Verified search' : 'Manual'}
                                                            </span>
                                                        )}
                                                        {job.deadlineAt && (
                                                            <span style={{ padding: '5px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.08)', color: '#b45309' }}>
                                                                Deadline {new Date(job.deadlineAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {job.applyUrl && (
                                                        <button onClick={() => window.open(job.applyUrl, '_blank', 'noopener,noreferrer')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }} title="Open application page">
                                                            <ExternalLink size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => openEditModal(job)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }} title="Edit job">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }} title="Delete job">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <MapPin size={14} /> {job.location}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Calendar size={14} /> {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : job.date}
                                                </div>
                                                {job.salary && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <DollarSign size={14} /> {job.salary}
                                                    </div>
                                                )}
                                                {job.applyUrl && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <LinkIcon size={14} /> {job.applyUrl.replace(/^https?:\/\//, '')}
                                                    </div>
                                                )}
                                            </div>

                                            <select
                                                className="form-input"
                                                style={{ marginTop: '16px', marginBottom: 0 }}
                                                value={job.status}
                                                onChange={(event) => handleStatusChange(job.id, event.target.value)}
                                            >
                                                {statuses.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>

                                            {job.notes && (
                                                <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                    {job.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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
                                <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Updated</th>
                                <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map((job) => (
                                <tr key={job.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '20px 24px', fontWeight: 700 }}>{job.company}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                        <div>{job.role}</div>
                                        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {job.source && (
                                                <span style={{ padding: '5px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, background: job.source === 'search-confirmed' ? 'rgba(16, 185, 129, 0.08)' : '#f8fafc', color: job.source === 'search-confirmed' ? '#047857' : '#475569' }}>
                                                    {job.source === 'search-confirmed' ? 'Verified search' : 'Manual'}
                                                </span>
                                            )}
                                            {job.deadlineAt && (
                                                <span style={{ padding: '5px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.08)', color: '#b45309' }}>
                                                    Deadline {new Date(job.deadlineAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <select
                                            className="form-input"
                                            style={{ marginBottom: 0, minWidth: '160px' }}
                                            value={job.status}
                                            onChange={(event) => handleStatusChange(job.id, event.target.value)}
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{job.location}</td>
                                    <td style={{ padding: '20px 24px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : job.date}</td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                                            {job.applyUrl && (
                                                <button onClick={() => window.open(job.applyUrl, '_blank', 'noopener,noreferrer')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }} title="Open application page">
                                                    <ExternalLink size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => openEditModal(job)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Edit job">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(job.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete job">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.55)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        zIndex: 1000,
                    }}
                    onClick={closeModal}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{ width: '100%', maxWidth: '720px', background: 'white', border: 'none', padding: '32px' }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '6px' }}>
                                    {formData.id ? 'Edit tracked job' : 'Add a new job'}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Save the role details, track the stage, and keep notes for your next follow-up.
                                </p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Company</label>
                                <input className="form-input" value={formData.company} onChange={(event) => handleInputChange('company', event.target.value)} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Role</label>
                                <input className="form-input" value={formData.role} onChange={(event) => handleInputChange('role', event.target.value)} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</label>
                                <select className="form-input" value={formData.status} onChange={(event) => handleInputChange('status', event.target.value)}>
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Date</label>
                                <input type="date" className="form-input" value={formData.date} onChange={(event) => handleInputChange('date', event.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Location</label>
                                <input className="form-input" value={formData.location} onChange={(event) => handleInputChange('location', event.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Salary</label>
                                <input className="form-input" value={formData.salary} onChange={(event) => handleInputChange('salary', event.target.value)} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <LinkIcon size={14} /> Job Link
                                </label>
                                <input className="form-input" value={formData.link} onChange={(event) => handleInputChange('link', event.target.value)} placeholder="https://company.com/careers/..." />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={14} /> Notes
                                </label>
                                <textarea
                                    className="form-input"
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                    value={formData.notes}
                                    onChange={(event) => handleInputChange('notes', event.target.value)}
                                    placeholder="Interview reminders, recruiter contacts, follow-up dates, or prep notes..."
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
                                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {formData.id ? 'Save Changes' : 'Create Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobTrackerPage;
