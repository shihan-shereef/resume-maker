const PUBLIC_GREENHOUSE_BOARD_TOKENS = [
    'stripe',
    'vercel',
    'figma',
    'reddit',
];

const normalizeWhitespace = (value = '') => value.replace(/\s+/g, ' ').trim();

const buildMetadataText = (metadata = []) => {
    if (!Array.isArray(metadata)) {
        return '';
    }

    return metadata
        .flatMap((entry) => {
            const value = entry?.value;
            if (Array.isArray(value)) {
                return value;
            }

            return typeof value === 'string' ? [value] : [];
        })
        .map((entry) => normalizeWhitespace(String(entry || '')))
        .filter(Boolean)
        .join(' ');
};

const detectWorkMode = (text = '') => {
    if (/\b(remote|distributed|work from home)\b/i.test(text)) {
        return 'Remote';
    }

    if (/\bhybrid\b/i.test(text)) {
        return 'Hybrid';
    }

    if (/\b(on[\s-]?site|in[\s-]?office)\b/i.test(text)) {
        return 'On-site';
    }

    return null;
};

const detectEmploymentType = (text = '') => {
    if (/\bfull[\s-]?time\b/i.test(text)) {
        return 'Full-time';
    }

    if (/\bpart[\s-]?time\b/i.test(text)) {
        return 'Part-time';
    }

    if (/\b(contract|contractor|freelance)\b/i.test(text)) {
        return 'Contract';
    }

    if (/\b(internship|intern)\b/i.test(text)) {
        return 'Internship';
    }

    if (/\btemporary\b/i.test(text)) {
        return 'Temporary';
    }

    return null;
};

const matchesLooseQuery = (haystack, query) => {
    const normalizedHaystack = normalizeWhitespace(haystack).toLowerCase();
    const normalizedQuery = normalizeWhitespace(query).toLowerCase();

    if (!normalizedQuery) {
        return true;
    }

    if (normalizedHaystack.includes(normalizedQuery)) {
        return true;
    }

    const terms = normalizedQuery.split(' ').filter((term) => term.length > 1);
    return terms.length > 0 && terms.every((term) => normalizedHaystack.includes(term));
};

export const normalizePublicGreenhouseJob = (boardToken, rawJob) => {
    const title = normalizeWhitespace(rawJob?.title || '');
    const company = normalizeWhitespace(rawJob?.company_name || boardToken);
    const location = normalizeWhitespace(rawJob?.location?.name || '');
    const metadataText = buildMetadataText(rawJob?.metadata);
    const searchableText = [title, company, location, metadataText].filter(Boolean).join(' ');
    const applyUrl = normalizeWhitespace(rawJob?.absolute_url || '');

    if (!title || !company || !applyUrl) {
        return null;
    }

    return {
        id: `gh-${rawJob.id || `${boardToken}-${title}`}`,
        title,
        company,
        location: location || null,
        employmentType: detectEmploymentType(searchableText),
        workMode: detectWorkMode(searchableText),
        applyUrl,
        sourceUrl: applyUrl,
        sourceProvider: 'Greenhouse',
        deadlineAt: null,
        deadlineText: null,
        timeLeftLabel: null,
        descriptionSnippet: null,
        requirements: [],
        updatedAt: rawJob?.updated_at || rawJob?.first_published || null,
        searchableText,
    };
};

const fetchPublicGreenhouseBoardJobs = async (boardToken) => {
    const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=false`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Greenhouse board request failed (${response.status})`);
    }

    const payload = await response.json().catch(() => ({}));
    return Array.isArray(payload?.jobs) ? payload.jobs : [];
};

const searchPublicGreenhouseJobs = async ({ role, location = '', filters = {}, limit = 18 }) => {
    const boardResults = await Promise.allSettled(
        PUBLIC_GREENHOUSE_BOARD_TOKENS.map(async (boardToken) => {
            const jobs = await fetchPublicGreenhouseBoardJobs(boardToken);
            return jobs
                .map((rawJob) => normalizePublicGreenhouseJob(boardToken, rawJob))
                .filter(Boolean);
        })
    );

    const seenApplyUrls = new Set();
    const matches = boardResults
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value)
        .filter((job) => {
            if (seenApplyUrls.has(job.applyUrl)) {
                return false;
            }

            seenApplyUrls.add(job.applyUrl);

            if (!matchesLooseQuery(job.searchableText, role)) {
                return false;
            }

            if (!matchesLooseQuery([job.location, job.searchableText].filter(Boolean).join(' '), location)) {
                return false;
            }

            if (filters.workMode && filters.workMode !== 'All' && job.workMode !== filters.workMode) {
                return false;
            }

            if (filters.employmentType && filters.employmentType !== 'All' && job.employmentType !== filters.employmentType) {
                return false;
            }

            return true;
        })
        .sort((left, right) => {
            const leftTime = Date.parse(left.updatedAt || '') || 0;
            const rightTime = Date.parse(right.updatedAt || '') || 0;
            return rightTime - leftTime;
        })
        .slice(0, limit)
        .map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            employmentType: job.employmentType,
            workMode: job.workMode,
            applyUrl: job.applyUrl,
            sourceUrl: job.sourceUrl,
            sourceProvider: job.sourceProvider,
            deadlineAt: job.deadlineAt,
            deadlineText: job.deadlineText,
            timeLeftLabel: job.timeLeftLabel,
            descriptionSnippet: job.descriptionSnippet,
            requirements: job.requirements,
        }));

    return matches;
};

const parseJsonResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return {};
    }

    return response.json().catch(() => ({}));
};

export const searchJobs = async ({ role, location = '', filters = {}, limit = 18 }) => {
    const endpoints = ['/api/jobs/search', '/api/jobs-search'];
    let lastError = new Error('Unable to load live verified jobs right now.');

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role,
                    location,
                    filters,
                    limit,
                }),
            });

            const payload = await parseJsonResponse(response);
            if (!response.ok) {
                throw new Error(payload?.error || 'Unable to load live verified jobs right now.');
            }

            const jobs = Array.isArray(payload?.data) ? payload.data : [];
            if (jobs.length > 0) {
                return jobs;
            }
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unable to load live verified jobs right now.');
        }
    }

    const fallbackJobs = await searchPublicGreenhouseJobs({
        role,
        location,
        filters,
        limit,
    });

    if (fallbackJobs.length > 0) {
        return fallbackJobs;
    }

    throw lastError;
};
