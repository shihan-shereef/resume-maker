import React, { useState } from 'react';
import { generateResumeContent } from '../lib/openrouter';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, MapPin, ExternalLink, Filter, Star, Loader2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

// Placeholder for LoadingMascot if it's not defined elsewhere.
// If it's a component, it should be imported. For now, I'll make it a simple div.
const LoadingMascot = ({ message }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Loader2 className="animate-spin" size={48} />
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{message}</p>
    </div>
);

const JobSearchPage = () => {
    const { resumeData } = useResume();
    const [searchTerm, setSearchTerm] = useState(resumeData.personalInfo.title || '');
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('All');
    const [experience, setExperience] = useState('All');
    const [salary, setSalary] = useState('All');
    const [remoteOnly, setRemoteOnly] = useState(false);

    const roles = ['All', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'UI/UX', 'Product Manager'];
    const expLevels = ['All', 'Entry Level', 'Mid-Level', 'Senior', 'Lead', 'Executive'];
    const salaryRanges = ['All', '$50k - $80k', '$80k - $120k', '$120k - $160k', '$160k+'];

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        }
    }, []); 

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setJobs([]);
        try {
            const prompt = `Generate a list of 100+ highly realistic job listings for a search query: "${searchTerm}" ${location ? `in ${location}` : ''}.
            Focus on ${role === 'All' ? 'tech' : role} roles.
            Filters: Experience: ${experience}, Salary: ${salary}, Remote Only: ${remoteOnly}.
            
            Return ONLY a JSON array of objects:
            [
                { "id": "unique-random-string", "title": "Job Title", "company": "Company Name", "location": "City, Country", "salary": "$120k - $160k", "type": "Full-time", "logo": "https://img.logo.dev/company.com?token=...", "match": 85, "posted": "2d ago", "about": "A 2-sentence description of the role.", "requirements": ["Req 1", "Req 2", "Req 3"], "preferences": ["Pref 1", "Pref 2"], "isRemote": true or false },
                ...
            ]
            Provide at least 30 diverse results across different companies and locations. Generate realistic logos using img.logo.dev with the company domain.`;

            const response = await generateResumeContent(prompt, "You are a specialized Job Market Intelligence AI.", "google/gemini-2.0-flash-001");
            
            let jsonStr = response;
            if (response.includes('```json')) {
                jsonStr = response.split('```json')[1].split('```')[0].trim();
            } else if (response.includes('```')) {
                jsonStr = response.split('```')[1].split('```')[0].trim();
            }
            
            const results = JSON.parse(jsonStr);
            setJobs(results);
            setFilteredJobs(results);
        } catch (error) {
            console.error("Job search failed:", error);
            setJobs([
                { id: 'fb1', title: searchTerm || 'Software Engineering Intern', company: 'Google', location: location || 'Remote', type: 'Internship', isRemote: true, match: 98, salary: '$8,000/mo', link: 'https://careers.google.com', about: 'Join our core infrastructure team to build the future of scalable web services.', requirements: ['Proficiency in Python/Java', 'Understanding of Data Structures'], preferences: ['Previous tech internship', 'Open source contributions'], logo: 'https://img.logo.dev/google.com?token=random' },
                { id: 'fb2', title: searchTerm || 'Product Design Intern', company: 'Meta', location: location || 'Menlo Park, CA', type: 'Internship', isRemote: false, match: 94, salary: '$7,500/mo', link: 'https://metacareers.com', about: 'Design intuitive and seamless experiences for billions of global users.', requirements: ['Figma expertise', 'Portfolio demonstrating UX process'], preferences: ['Prototyping animation skills'], logo: 'https://img.logo.dev/meta.com?token=random' }
            ]);
            setFilteredJobs(jobs);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (job) => {
        const existingTracker = JSON.parse(localStorage.getItem('tracked_jobs') || '[]');
        const newTrackedJob = {
            id: Date.now(),
            company: job.company,
            role: job.title,
            status: 'Applied',
            date: new Date().toISOString().split('T')[0],
            location: job.location,
            salary: job.salary || 'Competitive'
        };
        
        localStorage.setItem('tracked_jobs', JSON.stringify([...existingTracker, newTrackedJob]));
        setAppliedJobs(prev => ({...prev, [job.id]: true}));
        window.open(job.link || `https://www.google.com/search?q=${job.company}+careers`, '_blank');
        alert(`Successfully applied to ${job.company}! It has been added to your Job Tracker.`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 800, marginBottom: '8px' }}>
                            Takshila <span className="gradient-text">Job Discovery</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}>
                            Find the best matching jobs for your profile using our AI-powered discovery engine.
                        </p>
                    </div>
                    <div style={{ padding: '12px 20px', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '12px', maxWidth: '400px' }}>
                        <p style={{ fontSize: '0.8rem', color: '#856404', margin: 0, lineHeight: 1.4 }}>
                            <strong>AI Simulation:</strong> These job listings are generated by AI to match your resume profile for career preparation and matching purposes. Always verify current openings on company official career portals.
                        </p>
                    </div>
                </div>
            </header>

            <div className="glass-card">
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) minmax(150px, 1fr) auto', gap: '16px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div className="input-wrapper">
                                <Search size={18} className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Job title, keywords, or company" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div className="input-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Location (Remote, NY, Bangalore...)" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ height: '52px', padding: '0 32px' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Find Jobs'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Department</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input" style={{ width: '160px', height: '40px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Experience</label>
                            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="form-input" style={{ width: '160px', height: '40px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                {expLevels.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Salary Range</label>
                            <select value={salary} onChange={(e) => setSalary(e.target.value)} className="form-input" style={{ width: '160px', height: '40px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                {salaryRanges.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', userSelect: 'none' }}>
                            <input 
                                type="checkbox" 
                                checked={remoteOnly}
                                onChange={(e) => setRemoteOnly(e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                            />
                            Remote Only
                        </label>
                    </div>
                </form>
            </div>

            <div className="job-search-grid">
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
                        <LoadingMascot message="Scanning market with AI..." />
                    </div>
                ) : jobs.length > 0 ? (
                    jobs.map((job, i) => (
                        <div key={i} className="glass-card" onClick={() => setSelectedJob(job)} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700 }}>
                                <Star size={16} fill="#10b981" />
                                <span>{job.score}% Match</span>
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, paddingRight: '100px' }}>{job.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Briefcase size={14} /> {job.company}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={14} /> {job.location}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>{job.type || 'Full-time'}</span>
                                {job.isRemote && <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>Remote Friendly</span>}
                                {job.salary && <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', fontSize: '0.75rem', fontWeight: 600 }}>{job.salary}</span>}
                            </div>
                            
                            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                View Details <ExternalLink size={14} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
                        <div style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                            <Search size={64} strokeWidth={1} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Search for jobs to get started</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Use the search bar above to find relevant job opportunities.</p>
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
                        style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', background: 'white' }}
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
