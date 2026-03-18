const PUBLIC_GREENHOUSE_BOARD_TOKENS = [
    'airtable',
    'brex',
    'chime',
    'cloudflare',
    'coinbase',
    'datadog',
    'discord',
    'duolingo',
    'figma',
    'instacart',
    'reddit',
    'robinhood',
    'stripe',
    'vercel',
];

const PUBLIC_BOARD_CACHE_TTL_MS = 5 * 60 * 1000;
const publicBoardCache = new Map();

export const resetPublicJobSearchCache = () => {
    publicBoardCache.clear();
};

const normalizeWhitespace = (value = '') => value.replace(/\s+/g, ' ').trim();

const normalizeCompanyKey = (value = '') => normalizeWhitespace(value).toLowerCase();

const getTimestamp = (value) => Date.parse(value || '') || 0;

const buildBoardTokenCandidates = (query = '') => {
    const normalized = normalizeWhitespace(query).toLowerCase();
    const collapsed = normalized.replace(/[^a-z0-9]+/g, '');
    const dashed = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return Array.from(new Set([
        collapsed,
        dashed,
        ...PUBLIC_GREENHOUSE_BOARD_TOKENS,
    ].filter(Boolean)));
};

const buildSearchLabel = ({ role = '', location = '' }) => {
    const parts = [normalizeWhitespace(role), normalizeWhitespace(location)].filter(Boolean);
    return parts.join(' in ');
};

const buildUnavailableNotice = () => 'Showing live public ATS jobs from multiple companies while extended company-page search is unavailable.';

const buildBroadenedNotice = ({ role = '', location = '' }) => {
    const label = buildSearchLabel({ role, location });

    if (!label) {
        return '';
    }

    return `No exact live matches were found for "${label}". Showing current verified openings from multiple companies instead.`;
};

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

const matchesFilters = (job, filters = {}) => {
    if (filters.workMode && filters.workMode !== 'All' && job.workMode !== filters.workMode) {
        return false;
    }

    if (filters.employmentType && filters.employmentType !== 'All' && job.employmentType !== filters.employmentType) {
        return false;
    }

    return true;
};

const diversifyJobsByCompany = (jobs, limit) => {
    const groupedJobs = new Map();

    jobs.forEach((job) => {
        const key = normalizeCompanyKey(job.company) || job.applyUrl;

        if (!groupedJobs.has(key)) {
            groupedJobs.set(key, []);
        }

        groupedJobs.get(key).push(job);
    });

    const queues = Array.from(groupedJobs.values())
        .map((jobsForCompany) => jobsForCompany.sort((left, right) => getTimestamp(right.updatedAt) - getTimestamp(left.updatedAt)))
        .sort((left, right) => getTimestamp(right[0]?.updatedAt) - getTimestamp(left[0]?.updatedAt));

    const results = [];

    while (results.length < limit) {
        let addedInRound = false;

        for (const queue of queues) {
            if (queue.length === 0) {
                continue;
            }

            results.push(queue.shift());
            addedInRound = true;

            if (results.length >= limit) {
                break;
            }
        }

        if (!addedInRound) {
            break;
        }
    }

    return results;
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
    const cachedEntry = publicBoardCache.get(boardToken);
    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
        return cachedEntry.dataPromise;
    }

    const dataPromise = (async () => {
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
    })();

    publicBoardCache.set(boardToken, {
        expiresAt: Date.now() + PUBLIC_BOARD_CACHE_TTL_MS,
        dataPromise,
    });

    try {
        return await dataPromise;
    } catch (error) {
        publicBoardCache.delete(boardToken);
        throw error;
    }
};

const searchPublicGreenhouseJobs = async ({ role, location = '', filters = {}, limit = 18 }) => {
    const boardTokens = buildBoardTokenCandidates(role);
    const boardResults = await Promise.allSettled(
        boardTokens.map(async (boardToken) => {
            const jobs = await fetchPublicGreenhouseBoardJobs(boardToken);
            return jobs
                .map((rawJob) => normalizePublicGreenhouseJob(boardToken, rawJob))
                .filter(Boolean);
        })
    );

    const seenApplyUrls = new Set();
    const filteredMatches = boardResults
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

            return matchesFilters(job, filters);
        })
        .sort((left, right) => getTimestamp(right.updatedAt) - getTimestamp(left.updatedAt));

    return diversifyJobsByCompany(filteredMatches, limit).map((job) => ({
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
};

const parseJsonResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return {};
    }

    return response.json().catch(() => ({}));
};

export const searchJobsWithMeta = async ({ role, location = '', filters = {}, limit = 18 }) => {
    const endpoints = ['/api/jobs/search', '/api/jobs-search'];
    let lastError = null;
    let apiFailed = false;

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
                return {
                    jobs,
                    notice: '',
                    errorMessage: '',
                };
            }
        } catch (error) {
            apiFailed = true;
            lastError = error instanceof Error ? error : new Error('Unable to load live verified jobs right now.');
        }
    }

    const exactFallbackJobs = await searchPublicGreenhouseJobs({
        role,
        location,
        filters,
        limit,
    });

    if (exactFallbackJobs.length > 0) {
        return {
            jobs: exactFallbackJobs,
            notice: apiFailed ? buildUnavailableNotice() : '',
            errorMessage: '',
        };
    }

    if (role || location) {
        const locationFallbackJobs = location
            ? await searchPublicGreenhouseJobs({
                role: '',
                location,
                filters,
                limit,
            })
            : [];

        if (locationFallbackJobs.length > 0) {
            return {
                jobs: locationFallbackJobs,
                notice: buildBroadenedNotice({ role, location }),
                errorMessage: '',
            };
        }

        const broadFallbackJobs = await searchPublicGreenhouseJobs({
            role: '',
            location: '',
            filters,
            limit: Math.max(limit, PUBLIC_GREENHOUSE_BOARD_TOKENS.length),
        });

        if (broadFallbackJobs.length > 0) {
            return {
                jobs: broadFallbackJobs,
                notice: buildBroadenedNotice({ role, location }),
                errorMessage: '',
            };
        }
    }

    return {
        jobs: [],
        notice: '',
        errorMessage: role || location
            ? 'No live verified jobs matched your search right now.'
            : 'No live verified jobs are available from the verified sources right now.',
        technicalError: lastError?.message || '',
    };
};

export const searchJobs = async (options) => {
    const result = await searchJobsWithMeta(options);
    return result.jobs;
};
