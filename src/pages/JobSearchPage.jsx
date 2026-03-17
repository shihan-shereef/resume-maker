import React, { useState } from 'react';
import { generateResumeContent } from '../lib/openrouter';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, MapPin, ExternalLink, Filter, Star, Loader2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const JobSearchPage = () => {
    const { resumeData } = useResume();
    const [query, setQuery] = useState(resumeData.personalInfo.title || '');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState({});
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const searchQuery = `${query} ${location}`.trim();
            const prompt = `Generate a realistic list of 6 job openings for the query: "${searchQuery}".
            Return ONLY a raw JSON array of objects. No markdown, no preambles.
            Each object must strictly match this structure:
            {
                "id": "unique-random-string",
                "title": "Job Title",
                "company": "Realistic Tech Company Name",
                "location": "City, State or Remote",
                "type": "Full-time, Part-time, or Internship",
                "isRemote": true or false,
                "score": random number between 85 and 99,
                "salary": "Realistic Salary Range (e.g. $80k - $120k)",
                "link": "https://google.com/search?q=careers",
                "about": "A 2-sentence description of the role.",
                "requirements": ["Req 1", "Req 2", "Req 3"],
                "preferences": ["Pref 1", "Pref 2"]
            }`;

            const res = await generateResumeContent(prompt, "You are an expert Job API. Return only valid JSON array.", "google/gemini-2.0-flash-001");
            let cleanedRes = res;
            if (res.includes('```json')) {
                cleanedRes = res.split('```json')[1].split('```')[0].trim();
            } else if (res.includes('```')) {
                cleanedRes = res.split('```')[1].split('```')[0].trim();
            }

            const results = JSON.parse(cleanedRes);
            setJobs(results);
        } catch (error) {
            console.error("Job search failed:", error);
            // Fallback mock string if AI fails
            // Fallback mock string if AI fails
            setJobs([
                { id: 'fb1', title: query || 'Software Engineering Intern', company: 'Google', location: location || 'Remote', type: 'Internship', isRemote: true, score: 98, salary: '$8,000/mo', link: 'https://careers.google.com', about: 'Join our core infrastructure team to build the future of scalable web services.', requirements: ['Proficiency in Python/Java', 'Understanding of Data Structures'], preferences: ['Previous tech internship', 'Open source contributions'] },
                { id: 'fb2', title: query || 'Product Design Intern', company: 'Meta', location: location || 'Menlo Park, CA', type: 'Internship', isRemote: false, score: 94, salary: '$7,500/mo', link: 'https://metacareers.com', about: 'Design intuitive and seamless experiences for billions of global users.', requirements: ['Figma expertise', 'Portfolio demonstrating UX process'], preferences: ['Prototyping animation skills'] }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = (job) => {
        // Track the application
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
        
        // Update local UI
        setAppliedJobs(prev => ({...prev, [job.id]: true}));
        
        // Open the "application link"
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
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '250px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input 
                            type="text" 
                            placeholder="Job title, keywords, or company" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '48px' }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '150px', position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '48px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search Jobs'}
                    </button>
                    <button type="button" className="btn-secondary" style={{ padding: '12px' }}>
                        <Filter size={20} />
                    </button>
                </form>
            </div>

            <div className="job-search-grid">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="glass-card" style={{ height: '200px', opacity: 0.5 }}>
                            <div style={{ height: '20px', width: '60%', background: 'var(--glass-border)', borderRadius: '4px', marginBottom: '12px' }}></div>
                            <div style={{ height: '16px', width: '40%', background: 'var(--glass-border)', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div style={{ height: '32px', width: '100%', background: 'var(--glass-border)', borderRadius: '8px', marginTop: 'auto' }}></div>
                        </div>
                    ))
                ) : jobs.length > 0 ? (
                    jobs.map((job, i) => (
                        <div key={i} className="glass-card" onClick={() => setSelectedJob(job)} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } }}>
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
