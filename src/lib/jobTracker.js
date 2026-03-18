import { normalizeJobLink } from './jobLinks';

export const JOB_TRACKER_STORAGE_KEY = 'tracked_jobs';
export const PENDING_APPLICATIONS_STORAGE_KEY = 'pending_job_applications';

const normalizeJob = (job, index = 0) => ({
    id: job.id ?? `${Date.now()}-${index}`,
    company: job.company?.trim() || 'Unknown Company',
    role: job.role?.trim() || 'Untitled Role',
    status: job.status?.trim() || 'Wishlist',
    date: job.date || new Date().toISOString().split('T')[0],
    location: job.location?.trim() || 'Not specified',
    salary: job.salary?.trim() || '',
    notes: job.notes?.trim() || '',
    link: normalizeJobLink(job.link || job.applyUrl),
    applyUrl: normalizeJobLink(job.applyUrl || job.link),
    source: job.source?.trim() || 'manual',
    appliedAt: job.appliedAt || (job.status === 'Applied' ? new Date(`${job.date || new Date().toISOString().split('T')[0]}T00:00:00`).toISOString() : null),
    deadlineAt: job.deadlineAt || null,
    employmentType: job.employmentType?.trim() || '',
    workMode: job.workMode?.trim() || '',
});

const normalizePendingApplication = (job, index = 0) => ({
    id: job.id ?? `${Date.now()}-${index}`,
    company: job.company?.trim() || 'Unknown Company',
    role: job.role?.trim() || 'Untitled Role',
    location: job.location?.trim() || 'Not specified',
    applyUrl: normalizeJobLink(job.applyUrl || job.link),
    sourceUrl: normalizeJobLink(job.sourceUrl),
    sourceProvider: job.sourceProvider?.trim() || 'Company website',
    deadlineAt: job.deadlineAt || null,
    descriptionSnippet: job.descriptionSnippet?.trim() || '',
    requirements: Array.isArray(job.requirements) ? job.requirements.filter(Boolean) : [],
    employmentType: job.employmentType?.trim() || '',
    workMode: job.workMode?.trim() || '',
    createdAt: job.createdAt || new Date().toISOString(),
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

export const loadPendingApplications = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(PENDING_APPLICATIONS_STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed.map(normalizePendingApplication).filter((job) => job.applyUrl) : [];
    } catch (error) {
        console.error('Failed to load pending applications:', error);
        return [];
    }
};

export const savePendingApplications = (jobs) => {
    localStorage.setItem(
        PENDING_APPLICATIONS_STORAGE_KEY,
        JSON.stringify(jobs.map((job, index) => normalizePendingApplication(job, index)).filter((job) => job.applyUrl))
    );
};

export const upsertPendingApplication = (job) => {
    const existingJobs = loadPendingApplications();
    const normalizedJob = normalizePendingApplication(job);
    const existingIndex = existingJobs.findIndex((item) => item.applyUrl === normalizedJob.applyUrl);

    if (existingIndex >= 0) {
        existingJobs[existingIndex] = normalizedJob;
    } else {
        existingJobs.unshift(normalizedJob);
    }

    savePendingApplications(existingJobs);
    return existingJobs;
};

export const removePendingApplication = (applyUrl) => {
    const normalizedApplyUrl = normalizeJobLink(applyUrl);
    const updatedJobs = loadPendingApplications().filter((job) => job.applyUrl !== normalizedApplyUrl);
    savePendingApplications(updatedJobs);
    return updatedJobs;
};
