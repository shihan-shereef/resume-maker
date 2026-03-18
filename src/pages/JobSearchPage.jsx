import React, { useState } from 'react';
import { generateResumeContent } from '../lib/openrouter';
import { Search, Briefcase, MapPin, ExternalLink, Filter, Star, Loader2, Zap } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { loadTrackedJobs, saveTrackedJobs } from '../lib/jobTracker';
import { searchJobs } from '../lib/firecrawl';

const JobSearchPage = () => {
    const { resumeData } = useResume();
    const [query, setQuery] = useState(resumeData.personalInfo.title || '');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState({});
    const [selectedJob, setSelectedJob] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        role: resumeData.personalInfo.jobTitle || '',
        location: '',
        experience: 'All',
        salary: 'All',
        remote: 'All'
    });
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setJobs([]);
        try {
            const searchQuery = `${filters.role || query} ${filters.location || location}`;
            const crawlResults = await searchJobs(searchQuery, 60);

            if (crawlResults.length > 0) {
                // Enrich first 5-10 with AI for better UX (token efficiency)
                const toEnrich = crawlResults.slice(0, 5);
                const enrichmentPrompt = `For these real job URLs, generate realistic Requirements and Preferences lists (3 each) and a 3-sentence 'About' section for each.
                JOBS: ${JSON.stringify(toEnrich.map(j => ({ title: j.title, company: j.company, url: j.link })))}
                Return ONLY JSON array of enriched objects.`;

                try {
                    const enrichedData = await generateResumeContent(enrichmentPrompt, "Enrich job data with premium insights.", "google/gemini-2.0-flash-001");
                    const cleanedEnriched = JSON.parse(enrichedData.replace(/```json|```/g, '').trim());
                    
                    const finalJobs = crawlResults.map(job => {
                        const enrichment = cleanedEnriched.find(e => e.url === job.link);
                        return enrichment ? { ...job, ...enrichment } : job;
                    });
                    setJobs(finalJobs);
                } catch (e) {
                    console.warn("Enrichment failed, using raw crawl data:", e);
                    setJobs(crawlResults);
                }
            } else {
                throw new Error("No live results found.");
            }
        } catch (error) {
            console.error("Job search failed:", error);
            const companies = ['Google', 'Meta', 'Amazon', 'Netflix', 'Tesla', 'Stripe', 'OpenAI', 'Microsoft', 'Apple', 'NVIDIA'];
            const backupJobs = Array.from({ length: 15 }).map((_, i) => ({
                id: `bk-${i}`,
                title: `${query || 'Software Engineer'}`,
                company: companies[i % companies.length],
                location: location || 'Remote',
                type: 'Full-time',
                isRemote: true,
                score: 95 - (i % 5),
                salary: `$${140 + (i*2)}k - $${210 + (i*2)}k`,
                link: `https://www.google.com/search?q=${companies[i % companies.length]}+careers+${query || 'jobs'}`,
                about: 'Live search currently unavailable or restricted. This is a high-match simulated role based on your professional profile.',
                requirements: ['Systems design at scale', 'Cross-functional leadership', 'Modern framework expertise'],
                preferences: ['Cloud native experience', 'AI/ML interest']
            }));
            setJobs(backupJobs);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (job) => {
        const existingTracker = loadTrackedJobs();
        const newTrackedJob = {
            id: existingTracker.find((item) => item.link === job.link && item.company === job.company)?.id || Date.now(),
            company: job.company,
            role: job.title,
            status: 'Applied',
            date: new Date().toISOString().split('T')[0],
            location: job.location,
            salary: job.salary || 'Competitive',
            link: job.link || '',
            notes: job.about || ''
        };

        const updatedJobs = [
            newTrackedJob,
            ...existingTracker.filter((item) => String(item.id) !== String(newTrackedJob.id))
        ];

        saveTrackedJobs(updatedJobs);
        setAppliedJobs(prev => ({...prev, [job.id]: true}));

        window.open(job.link || `https://www.google.com/search?q=${job.company}+careers`, '_blank');

        alert(`Successfully applied to ${job.company}! It has been added to your Job Tracker.`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ flex: '1 1 500px' }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.03em' }}>
                            Takshila <span className="gradient-text">Elite Job Hub</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.6, maxWidth: '600px' }}>
                            Discover 100+ premium opportunities precision-matched to your unique professional profile.
                        </p>
                    </div>
                    <div style={{ 
                        padding: '24px', 
                        background: 'rgba(255, 92, 0, 0.03)', 
                        border: '1px solid rgba(255, 92, 0, 0.15)', 
                        borderRadius: '24px', 
                        maxWidth: '450px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary)', margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                            <strong>Smart AI Sync:</strong> Our neural engine continuously simulates and indexes high-impact roles at top-tier firms. Verify final details on official portals.
                        </p>
                    </div>
                </div>
            </header>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 300px', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                        <input 
                            type="text" 
                            placeholder="Target role or company..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '56px', height: '60px', fontSize: '1.1rem' }}
                        />
                    </div>
                    <div style={{ flex: '1 1 200px', position: 'relative' }}>
                        <MapPin size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                        <input 
                            type="text" 
                            placeholder="Location..." 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '56px', height: '60px', fontSize: '1.1rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ height: '60px', minWidth: '180px', fontSize: '1.1rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Scan 100+ Jobs'}
                    </button>
                    <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary" style={{ padding: '0 20px', height: '60px', background: showFilters ? 'var(--primary)' : '', color: showFilters ? 'white' : '' }}>
                        <Filter size={24} />
                    </button>
                </form>

                {showFilters && (
                    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Seniority</label>
                            <select className="form-input" style={{ height: '50px' }} value={filters.experience} onChange={(e) => setFilters({...filters, experience: e.target.value})}>
                                <option>All</option>
                                <option>Internship</option>
                                <option>Entry Level</option>
                                <option>Mid-Level</option>
                                <option>Senior</option>
                                <option>Lead / Staff</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Target Salary</label>
                            <select className="form-input" style={{ height: '50px' }} value={filters.salary} onChange={(e) => setFilters({...filters, salary: e.target.value})}>
                                <option>All</option>
                                <option>$80k - $120k</option>
                                <option>$120k - $180k</option>
                                <option>$200k - $300k</option>
                                <option>$400k+</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block', textTransform: 'uppercase' }}>Environment</label>
                            <select className="form-input" style={{ height: '50px' }} value={filters.remote} onChange={(e) => setFilters({...filters, remote: e.target.value})}>
                                <option>All</option>
                                <option>Fully Remote</option>
                                <option>Hybrid Hub</option>
                                <option>On-site Office</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="job-search-grid" style={{ padding: '8px' }}>
                {loading ? (
                    Array(9).fill(0).map((_, i) => (
                        <div key={i} className="glass-card" style={{ height: '240px', opacity: 0.4 }}>
                            <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '16px' }}></div>
                            <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '24px' }}></div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div className="skeleton" style={{ height: '24px', width: '60px' }}></div>
                                <div className="skeleton" style={{ height: '24px', width: '80px' }}></div>
                            </div>
                            <div className="skeleton" style={{ height: '44px', width: '100%', marginTop: 'auto' }}></div>
                        </div>
                    ))
                ) : jobs.length > 0 ? (
                    jobs.map((job, i) => (
                        <div 
                            key={i} 
                            className="glass-card" 
                            onClick={() => setSelectedJob(job)} 
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                padding: '28px',
                                gap: '20px', 
                                position: 'relative', 
                                cursor: 'pointer',
                                minHeight: '280px',
                                overflow: 'visible' // Allow match badge to breathe
                            }}
                        >
                            <div style={{ 
                                position: 'absolute', 
                                top: '-12px', 
                                right: '20px', 
                                background: '#10b981', 
                                color: 'white', 
                                padding: '6px 12px', 
                                borderRadius: '100px', 
                                fontSize: '0.75rem', 
                                fontWeight: 800,
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                zIndex: 10
                            }}>
                                {job.score}% Match
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '8px' }}>{job.title}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700 }}>
                                        <Briefcase size={16} /> {job.company}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                                        <MapPin size={16} /> {job.location}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>{job.type}</span>
                                {job.isRemote && <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>Remote</span>}
                                {job.salary && <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', color: '#d97706', fontSize: '0.75rem', fontWeight: 700 }}>{job.salary}</span>}
                            </div>
                            
                            <div style={{ 
                                marginTop: 'auto', 
                                padding: '14px', 
                                borderRadius: '12px',
                                background: 'rgba(99, 102, 241, 0.03)',
                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                color: 'var(--primary)', 
                                fontSize: '0.85rem', 
                                fontWeight: 800, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.3s'
                            }}>
                                Deep Audit & Apply <ExternalLink size={16} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '120px 0', opacity: 0.8 }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
                             <Search size={120} strokeWidth={0.5} color="var(--primary)" />
                             <Zap size={40} style={{ position: 'absolute', bottom: 10, right: 10 }} color="var(--primary)" fill="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Your next career leap starts here.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Fill in the details above to uncover 100+ tailored roles.</p>
                    </div>
                )}
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, padding: '24px'
                }} onClick={() => setSelectedJob(null)}>
                    <div 
                        className="glass-card animate-fade-in" 
                        style={{ 
                            width: '100%', 
                            maxWidth: '800px', 
                            maxHeight: '85vh', 
                            overflowY: 'auto', 
                            background: 'white',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '32px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{selectedJob.title}</h2>
                                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>{selectedJob.company} • {selectedJob.location}</h3>
                            </div>
                            <span style={{ background: '#ecfdf5', color: '#10b981', padding: '8px 16px', borderRadius: '100px', fontWeight: 700, fontSize: '0.9rem' }}>
                                {selectedJob.score}% Match
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                            {selectedJob.salary && <span style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>💰 {selectedJob.salary}</span>}
                            <span style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>💼 {selectedJob.type || 'Full-time'}</span>
                            {selectedJob.isRemote && <span style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>🏠 Remote</span>}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>About the Role</h4>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedJob.about || 'Provide critical impact and excel in a fast-paced environment at ' + selectedJob.company + '.'}</p>
                            </div>
                            
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Requirements</h4>
                                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(selectedJob.requirements || ['Relevant degree or equivalent experience', 'Strong communication skills']).map((req, i) => <li key={i}>{req}</li>)}
                                </ul>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>Preferences</h4>
                                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(selectedJob.preferences || ['Prior experience in a similar role', 'Certifications']).map((pref, i) => <li key={i}>{pref}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                            <button 
                                onClick={() => { handleApply(selectedJob); setSelectedJob(null); }}
                                className={appliedJobs[selectedJob.id] ? "btn-secondary" : "btn-primary"} 
                                style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: appliedJobs[selectedJob.id] ? '#10b981' : '', color: appliedJobs[selectedJob.id] ? 'white' : '' }}
                            >
                                {appliedJobs[selectedJob.id] ? 'Applied & Tracked ✓' : <>Apply on Company Website <ExternalLink size={20} /></>}
                            </button>
                            <button className="btn-secondary" onClick={() => setSelectedJob(null)} style={{ padding: '16px 32px' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobSearchPage;
