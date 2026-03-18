export const JOB_TRACKER_STORAGE_KEY = 'tracked_jobs';

const normalizeJob = (job, index = 0) => ({
    id: job.id ?? `${Date.now()}-${index}`,
    company: job.company?.trim() || 'Unknown Company',
    role: job.role?.trim() || 'Untitled Role',
    status: job.status?.trim() || 'Wishlist',
    date: job.date || new Date().toISOString().split('T')[0],
    location: job.location?.trim() || 'Not specified',
    salary: job.salary?.trim() || 'Competitive',
    notes: job.notes?.trim() || '',
    link: job.link?.trim() || '',
});

export const loadTrackedJobs = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(JOB_TRACKER_STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed.map(normalizeJob) : [];
    } catch (error) {
        console.error('Failed to load tracked jobs:', error);
        return [];
    }
};

export const saveTrackedJobs = (jobs) => {
    localStorage.setItem(
        JOB_TRACKER_STORAGE_KEY,
        JSON.stringify(jobs.map((job, index) => normalizeJob(job, index)))
    );
};

export const upsertTrackedJob = (job) => {
    const existingJobs = loadTrackedJobs();
    const normalizedJob = normalizeJob(job);
    const existingIndex = existingJobs.findIndex((item) => String(item.id) === String(normalizedJob.id));

    if (existingIndex >= 0) {
        existingJobs[existingIndex] = normalizedJob;
    } else {
        existingJobs.unshift(normalizedJob);
    }

    saveTrackedJobs(existingJobs);
    return existingJobs;
};
