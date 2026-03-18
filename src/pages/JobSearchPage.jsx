import React, { useEffect, useMemo, useState } from 'react';
import { Search, Briefcase, MapPin, ExternalLink, Filter, Loader2, Calendar, Link as LinkIcon, FileText, X } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import {
    loadPendingApplications,
    loadTrackedJobs,
    removePendingApplication,
    saveTrackedJobs,
    upsertPendingApplication,
} from '../lib/jobTracker';
import { searchJobsWithMeta } from '../lib/firecrawl';
import {
    formatJobDeadline,
    getJobApplicationDestinationLabel,
    getJobApplicationUrl,
    getTimeLeftLabel,
    openJobApplication,
} from '../lib/jobLinks';

const INITIAL_FILTERS = {
    employmentType: 'All',
    workMode: 'All',
};

const buildTrackedJobFromPendingApplication = (job, existingJobs) => {
    const appliedAt = new Date().toISOString();
    const matchingJob = existingJobs.find((item) => item.applyUrl === job.applyUrl);

    return {
        id: matchingJob?.id || job.id || `${Date.now()}`,
        company: job.company,
        role: job.role,
        status: 'Applied',
        date: appliedAt.split('T')[0],
        location: job.location || 'Not specified',
        salary: '',
        notes: job.descriptionSnippet || '',
        link: job.applyUrl,
        applyUrl: job.applyUrl,
        source: 'search-confirmed',
        appliedAt,
        deadlineAt: job.deadlineAt || null,
        employmentType: job.employmentType || '',
        workMode: job.workMode || '',
    };
};

const getLatestPendingApplication = () => loadPendingApplications()[0] || null;

const JobSearchPage = () => {
    const { resumeData } = useResume();
    const suggestedRole = resumeData.personalInfo.jobTitle || resumeData.personalInfo.title || '';
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [trackedJobs, setTrackedJobs] = useState(() => loadTrackedJobs());
    const [pendingApplication, setPendingApplication] = useState(() => getLatestPendingApplication());
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchNotice, setSearchNotice] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [showPendingPrompt, setShowPendingPrompt] = useState(false);
    const [now, setNow] = useState(Date.now());

    const trackedApplyUrls = useMemo(
        () => new Set(trackedJobs.map((job) => job.applyUrl || job.link).filter(Boolean)),
        [trackedJobs]
    );

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNow(Date.now());
        }, 60 * 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const syncPendingPrompt = () => {
            const latestPending = getLatestPendingApplication();
            setPendingApplication(latestPending);

            if (latestPending) {
                setShowPendingPrompt(true);
            }
        };

        const handleFocus = () => {
            syncPendingPrompt();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                syncPendingPrompt();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleSearch = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const role = query.trim();
        const normalizedLocation = location.trim();
        const isBroadSearch = !role;

        setLoading(true);
        setHasSearched(true);
        setErrorMessage('');
        setSearchNotice('');
        setJobs([]);

        try {
            const result = await searchJobsWithMeta({
                role,
                location: normalizedLocation,
                filters,
                limit: isBroadSearch ? 30 : 18,
            });

            setJobs(result.jobs);
            setSearchNotice(result.notice || '');

            if (result.jobs.length === 0) {
                setErrorMessage(
                    result.errorMessage || (
                        isBroadSearch
                            ? 'No live verified jobs are available from the verified sources right now.'
                            : 'No live verified jobs matched your search right now.'
                    )
                );
            }
        } catch (error) {
            console.error('Verified job search failed:', error);
            setErrorMessage('Unable to load live verified jobs right now.');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (job) => {
        const applicationUrl = getJobApplicationUrl(job);
        if (!applicationUrl) {
            window.alert('This listing does not have a verified application link right now.');
            return;
        }

        const pendingJob = {
            id: job.id,
            company: job.company,
            role: job.title,
            location: job.location || 'Not specified',
            applyUrl: applicationUrl,
            sourceUrl: job.sourceUrl || applicationUrl,
            sourceProvider: job.sourceProvider || 'Company website',
            deadlineAt: job.deadlineAt || null,
            descriptionSnippet: job.descriptionSnippet || '',
            requirements: job.requirements || [],
            employmentType: job.employmentType || '',
            workMode: job.workMode || '',
            createdAt: new Date().toISOString(),
        };

        upsertPendingApplication(pendingJob);
        setPendingApplication(getLatestPendingApplication());
        setSelectedJob(null);
        setShowPendingPrompt(false);
        openJobApplication(job);
    };

    const handleConfirmSubmitted = () => {
        if (!pendingApplication) {
            return;
        }

        const currentTrackedJobs = loadTrackedJobs();
        const trackedJob = buildTrackedJobFromPendingApplication(pendingApplication, currentTrackedJobs);
        const updatedJobs = [
            trackedJob,
            ...currentTrackedJobs.filter((job) => job.applyUrl !== trackedJob.applyUrl),
        ];

        saveTrackedJobs(updatedJobs);
        removePendingApplication(pendingApplication.applyUrl);
        setTrackedJobs(updatedJobs);
        setPendingApplication(null);
        setShowPendingPrompt(false);

        window.alert(`Added ${trackedJob.role} at ${trackedJob.company} to your Job Tracker.`);
    };

    const handleClearPendingApplication = () => {
        if (!pendingApplication) {
            return;
        }

        removePendingApplication(pendingApplication.applyUrl);
        setPendingApplication(null);
        setShowPendingPrompt(false);
    };

    const selectedJobApplyUrl = selectedJob ? getJobApplicationUrl(selectedJob) : '';
    const selectedJobIsTracked = Boolean(selectedJobApplyUrl && trackedApplyUrls.has(selectedJobApplyUrl));
    const selectedJobIsPending = Boolean(selectedJobApplyUrl && pendingApplication?.applyUrl === selectedJobApplyUrl);
    const selectedJobDestination = selectedJob ? getJobApplicationDestinationLabel(selectedJob) : '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ flex: '1 1 500px' }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.03em' }}>
                            Live <span className="gradient-text">Verified Job Search</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.6, maxWidth: '700px' }}>
                            Search live verified openings from multiple companies with real application links. Leave the role field blank to browse current openings, and deadlines come from the career page when they are published.
                        </p>
                    </div>
                    <div style={{
                        padding: '24px',
                        background: 'rgba(255, 92, 0, 0.03)',
                        border: '1px solid rgba(255, 92, 0, 0.15)',
                        borderRadius: '24px',
                        maxWidth: '460px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                            Results are filtered to live company career pages and trusted ATS providers. Closed jobs and expired deadlines stay out of the list, and the first results are spread across different companies.
                        </p>
                    </div>
                </div>
            </header>

            {pendingApplication && (
                <div className="glass-card" style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', border: '1px solid rgba(16, 185, 129, 0.22)', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Pending Application
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {pendingApplication.role} at {pendingApplication.company}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            After you submit on the company page, confirm it here to move the job into your tracker.
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button className="btn-secondary" onClick={() => openJobApplication(pendingApplication)}>
                            Open Application Again <ExternalLink size={18} />
                        </button>
                        <button className="btn-primary" onClick={handleConfirmSubmitted}>
                            I Submitted It
                        </button>
                        <button className="btn-secondary" onClick={handleClearPendingApplication}>
                            Clear
                        </button>
                    </div>
                </div>
            )}

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 320px', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                        <input
                            type="text"
                            placeholder={suggestedRole ? `Target role or company, or leave blank... e.g. ${suggestedRole}` : 'Target role or company, or leave blank...'}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '56px', height: '60px', fontSize: '1.1rem' }}
                        />
                    </div>
                    <div style={{ flex: '1 1 220px', position: 'relative' }}>
                        <MapPin size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                        <input
                            type="text"
                            placeholder="Location..."
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '56px', height: '60px', fontSize: '1.1rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '60px', minWidth: '190px', fontSize: '1.1rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Search Live Jobs'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowFilters((current) => !current)}
                        className="btn-secondary"
                        style={{ padding: '0 20px', height: '60px', background: showFilters ? 'var(--primary)' : '', color: showFilters ? 'white' : '' }}
                    >
                        <Filter size={24} />
                    </button>
                </form>

                {showFilters && (
                    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Employment Type</label>
                            <select
                                className="form-input"
                                style={{ height: '50px' }}
                                value={filters.employmentType}
                                onChange={(event) => setFilters((current) => ({ ...current, employmentType: event.target.value }))}
                            >
                                <option>All</option>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                                <option>Temporary</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Work Arrangement</label>
                            <select
                                className="form-input"
                                style={{ height: '50px' }}
                                value={filters.workMode}
                                onChange={(event) => setFilters((current) => ({ ...current, workMode: event.target.value }))}
                            >
                                <option>All</option>
                                <option>Remote</option>
                                <option>Hybrid</option>
                                <option>On-site</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {searchNotice && (
                <div
                    className="glass-card"
                    style={{
                        padding: '18px 22px',
                        border: '1px solid rgba(245, 158, 11, 0.24)',
                        background: 'rgba(245, 158, 11, 0.06)',
                        color: '#92400e',
                        fontWeight: 700,
                        lineHeight: 1.6,
                    }}
                >
                    {searchNotice}
                </div>
            )}

            <div className="job-search-grid" style={{ padding: '8px' }}>
                {loading ? (
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} className="glass-card" style={{ minHeight: '260px', opacity: 0.4 }}>
                            <div className="skeleton" style={{ height: '20px', width: '35%', marginBottom: '18px' }}></div>
                            <div className="skeleton" style={{ height: '28px', width: '70%', marginBottom: '16px' }}></div>
                            <div className="skeleton" style={{ height: '16px', width: '55%', marginBottom: '20px' }}></div>
                            <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '18px' }}></div>
                            <div className="skeleton" style={{ height: '44px', width: '100%', marginTop: 'auto' }}></div>
                        </div>
                    ))
                ) : jobs.length > 0 ? (
                    jobs.map((job) => {
                        const applyUrl = getJobApplicationUrl(job);
                        const isTracked = trackedApplyUrls.has(applyUrl);
                        const isPending = pendingApplication?.applyUrl === applyUrl;

                        return (
                            <div
                                key={job.id}
                                className="glass-card"
                                onClick={() => setSelectedJob(job)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '28px',
                                    gap: '18px',
                                    cursor: 'pointer',
                                    minHeight: '290px',
                                    background: 'white',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                                    <span style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255, 92, 0, 0.08)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 800 }}>
                                        {job.sourceProvider}
                                    </span>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: job.deadlineAt ? '#b45309' : 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {job.deadlineAt ? getTimeLeftLabel(job.deadlineAt, now) : 'Not listed'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            Apply by {formatJobDeadline(job.deadlineAt)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                        {job.title}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700 }}>
                                            <Briefcase size={16} /> {job.company}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                                            <MapPin size={16} /> {job.location || 'Location not listed'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {job.employmentType && (
                                        <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                                            {job.employmentType}
                                        </span>
                                    )}
                                    {job.workMode && (
                                        <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                                            {job.workMode}
                                        </span>
                                    )}
                                </div>

                                {job.descriptionSnippet && (
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.92rem' }}>
                                        {job.descriptionSnippet}
                                    </p>
                                )}

                                <div style={{
                                    marginTop: 'auto',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: isTracked
                                        ? 'rgba(16, 185, 129, 0.08)'
                                        : isPending
                                            ? 'rgba(245, 158, 11, 0.08)'
                                            : 'rgba(99, 102, 241, 0.03)',
                                    border: isTracked
                                        ? '1px solid rgba(16, 185, 129, 0.2)'
                                        : isPending
                                            ? '1px solid rgba(245, 158, 11, 0.18)'
                                            : '1px solid rgba(99, 102, 241, 0.1)',
                                    color: isTracked ? '#047857' : isPending ? '#b45309' : 'var(--primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                }}>
                                    {isTracked ? 'Applied & Tracked' : isPending ? 'Application Opened - Awaiting Confirmation' : 'View Verified Details'} <ExternalLink size={16} />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '120px 0', opacity: 0.9 }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
                            <Search size={120} strokeWidth={0.6} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
                            {hasSearched ? 'No live verified jobs found' : 'Search live job pages, not demo listings'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
                            {errorMessage || 'Use the search above to load open roles with verified application pages and published deadlines when available. You can also leave the role field blank and press Search to browse current verified jobs.'}
                        </p>
                    </div>
                )}
            </div>

            {selectedJob && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '24px',
                    }}
                    onClick={() => setSelectedJob(null)}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{
                            width: '100%',
                            maxWidth: '860px',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            background: 'white',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '28px',
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                                    {selectedJob.sourceProvider}
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{selectedJob.title}</h2>
                                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '6px' }}>
                                    {selectedJob.company} • {selectedJob.location || 'Location not listed'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedJob(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {selectedJob.employmentType && <span style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>{selectedJob.employmentType}</span>}
                            {selectedJob.workMode && <span style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>{selectedJob.workMode}</span>}
                            <span style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>
                                {selectedJobIsTracked ? 'Applied & tracked' : selectedJobIsPending ? 'Pending confirmation' : 'Ready to apply'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            <div style={{ padding: '18px', borderRadius: '18px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '10px' }}>
                                    <Calendar size={18} /> Application Deadline
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {formatJobDeadline(selectedJob.deadlineAt)}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                                    {getTimeLeftLabel(selectedJob.deadlineAt, now)}
                                </div>
                            </div>

                            <div style={{ padding: '18px', borderRadius: '18px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '10px' }}>
                                    <LinkIcon size={18} /> Official Destination
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {selectedJobDestination}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                                    This is the official application page that will open for you.
                                </div>
                            </div>
                        </div>

                        {selectedJob.descriptionSnippet && (
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.08rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
                                    <FileText size={18} /> Job Summary
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                                    {selectedJob.descriptionSnippet}
                                </p>
                            </div>
                        )}

                        {selectedJob.requirements?.length > 0 && (
                            <div>
                                <h4 style={{ fontSize: '1.08rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>Requirements Found On Page</h4>
                                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                                    {selectedJob.requirements.map((requirement, index) => (
                                        <li key={index}>{requirement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '24px', flexWrap: 'wrap' }}>
                            {!selectedJobIsTracked && selectedJobIsPending && (
                                <button className="btn-secondary" onClick={handleConfirmSubmitted} style={{ padding: '16px 26px' }}>
                                    I Submitted It
                                </button>
                            )}
                            <button
                                onClick={() => handleApply(selectedJob)}
                                className={selectedJobIsTracked ? 'btn-secondary' : 'btn-primary'}
                                style={{ flex: '1 1 260px', padding: '16px', fontSize: '1.05rem', background: selectedJobIsTracked ? '#10b981' : '', color: selectedJobIsTracked ? 'white' : '' }}
                            >
                                {selectedJobIsTracked ? 'Applied & Tracked ✓' : selectedJobIsPending ? 'Open Application Again' : 'Open Official Application'} <ExternalLink size={20} />
                            </button>
                            <button className="btn-secondary" onClick={() => setSelectedJob(null)} style={{ padding: '16px 32px' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {pendingApplication && showPendingPrompt && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.48)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        zIndex: 2100,
                    }}
                    onClick={() => setShowPendingPrompt(false)}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{ width: '100%', maxWidth: '640px', background: 'white', padding: '32px', border: 'none' }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>Did you finish the application?</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            Confirm only after you have actually submitted your application on the company page. That confirmation is what moves the job into your tracker.
                        </p>

                        <div style={{ padding: '18px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {pendingApplication.role} at {pendingApplication.company}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                                {pendingApplication.location} • {pendingApplication.sourceProvider}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <button className="btn-secondary" onClick={handleClearPendingApplication}>
                                Clear
                            </button>
                            <button className="btn-secondary" onClick={() => setShowPendingPrompt(false)}>
                                Not Yet
                            </button>
                            <button className="btn-primary" onClick={handleConfirmSubmitted}>
                                I Submitted It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobSearchPage;
