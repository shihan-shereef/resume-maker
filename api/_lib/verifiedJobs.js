import { Buffer } from 'node:buffer';
import { load } from 'cheerio';
import { normalizeJobLink } from '../../src/lib/jobLinks.js';

const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';
const BLOCKED_HOST_PATTERNS = [
    /(^|\.)linkedin\.com$/i,
    /(^|\.)indeed\.com$/i,
    /(^|\.)glassdoor\.com$/i,
    /(^|\.)ziprecruiter\.com$/i,
    /(^|\.)monster\.com$/i,
    /(^|\.)careerbuilder\.com$/i,
    /(^|\.)simplyhired\.com$/i,
    /(^|\.)talent\.com$/i,
    /(^|\.)jooble\.org$/i,
    /(^|\.)wellfound\.com$/i,
    /(^|\.)naukri\.com$/i,
    /(^|\.)foundit\.in$/i,
];
const TRUSTED_ATS_HOSTS = [
    { name: 'Greenhouse', pattern: /(^|\.)greenhouse\.io$/i },
    { name: 'Lever', pattern: /(^|\.)lever\.co$/i },
    { name: 'Workday', pattern: /(^|\.)myworkdayjobs\.com$/i },
    { name: 'Workday', pattern: /(^|\.)myworkdaysite\.com$/i },
    { name: 'Ashby', pattern: /(^|\.)ashbyhq\.com$/i },
];
const TRUSTED_ATS_SEARCH_SITES = [
    'greenhouse.io',
    'lever.co',
    'ashbyhq.com',
    'myworkdayjobs.com',
    'myworkdaysite.com',
];
const CLOSED_PATTERNS = [
    /no longer accepting applications?/i,
    /applications? (?:for this role|for this job)? (?:are|is) closed/i,
    /this job (?:is )?(?:closed|expired|inactive|filled)/i,
    /position has been filled/i,
    /posting is no longer available/i,
    /application deadline has passed/i,
    /closing date has passed/i,
];
const APPLY_TEXT_PATTERN = /\b(apply now|apply for this job|start application|submit application|apply)\b/i;
const JOB_PATH_PATTERN = /(career|careers|job|jobs|opening|openings|position|positions)/i;
const REQUIREMENT_HEADING_PATTERN = /^(requirements|qualifications|what you(?:'ll| will)? need|what you bring|skills|experience)$/i;
const EMPLOYMENT_TYPE_PATTERNS = [
    { label: 'Full-time', pattern: /\bfull[\s-]?time\b/i },
    { label: 'Part-time', pattern: /\bpart[\s-]?time\b/i },
    { label: 'Contract', pattern: /\b(contract|contractor|freelance)\b/i },
    { label: 'Internship', pattern: /\b(internship|intern)\b/i },
    { label: 'Temporary', pattern: /\btemporary\b/i },
];
const WORK_MODE_PATTERNS = [
    { label: 'Remote', pattern: /\b(remote|work from home|distributed)\b/i },
    { label: 'Hybrid', pattern: /\bhybrid\b/i },
    { label: 'On-site', pattern: /\b(on[\s-]?site|in[\s-]?office)\b/i },
];

const normalizeWhitespace = (value = '') => value.replace(/\s+/g, ' ').trim();

const stripHtml = (value = '') => normalizeWhitespace(value.replace(/<[^>]+>/g, ' '));

const firstNonEmpty = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';

const looksLikeBlockedHost = (hostname = '') => BLOCKED_HOST_PATTERNS.some((pattern) => pattern.test(hostname));

const detectTrustedAtsProvider = (hostname = '') => {
    const match = TRUSTED_ATS_HOSTS.find((entry) => entry.pattern.test(hostname));
    return match?.name || '';
};

const getSourceProvider = (hostname = '') => detectTrustedAtsProvider(hostname) || 'Company website';
const isTrustedAtsHost = (hostname = '') => Boolean(detectTrustedAtsProvider(hostname));

const isAllowedApplyHost = (hostname, sourceHostname) => {
    if (!hostname || looksLikeBlockedHost(hostname)) {
        return false;
    }

    if (hostname === sourceHostname || hostname.endsWith(`.${sourceHostname}`)) {
        return true;
    }

    return Boolean(detectTrustedAtsProvider(hostname));
};

const flattenJsonLd = (node, output = []) => {
    if (!node) {
        return output;
    }

    if (Array.isArray(node)) {
        node.forEach((entry) => flattenJsonLd(entry, output));
        return output;
    }

    if (typeof node === 'object') {
        output.push(node);

        if (Array.isArray(node['@graph'])) {
            flattenJsonLd(node['@graph'], output);
        }
    }

    return output;
};

const parseJsonSafely = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const extractJobPostingSchema = ($) => {
    const schemas = [];

    $('script[type="application/ld+json"]').each((_, element) => {
        const rawValue = $(element).contents().text().trim();
        if (!rawValue) {
            return;
        }

        const parsed = parseJsonSafely(rawValue);
        if (parsed) {
            flattenJsonLd(parsed, schemas);
        }
    });

    return schemas.find((schema) => {
        const type = schema?.['@type'];
        return typeof type === 'string'
            ? type.toLowerCase() === 'jobposting'
            : Array.isArray(type) && type.some((entry) => String(entry).toLowerCase() === 'jobposting');
    }) || null;
};

const cleanDescription = (value = '') => stripHtml(value).replace(/\s{2,}/g, ' ').trim();

const getMetaContent = ($, selector) => normalizeWhitespace($(selector).attr('content') || '');

const getHostname = (url) => {
    try {
        return new URL(url).hostname.toLowerCase();
    } catch {
        return '';
    }
};

const normalizePossibleUrl = (value, baseUrl) => {
    if (!value || typeof value !== 'string') {
        return '';
    }

    try {
        return normalizeJobLink(new URL(value, baseUrl).toString());
    } catch {
        return normalizeJobLink(value);
    }
};

const extractCompanyFromResult = (resultTitle = '', hostname = '') => {
    const titleParts = resultTitle.split(/[|—–-]/).map((entry) => normalizeWhitespace(entry)).filter(Boolean);
    if (titleParts.length > 1) {
        return titleParts[titleParts.length - 1];
    }

    const hostnameParts = hostname.replace(/^www\./, '').split('.');
    return hostnameParts.length > 1 ? hostnameParts[0] : hostname;
};

const extractLocationFromSchema = (schema) => {
    const locationEntries = Array.isArray(schema?.jobLocation) ? schema.jobLocation : [schema?.jobLocation].filter(Boolean);
    const labels = locationEntries.map((entry) => {
        const address = entry?.address || {};
        const parts = [
            address.addressLocality,
            address.addressRegion,
            address.addressCountry,
        ].map((value) => normalizeWhitespace(value || '')).filter(Boolean);

        return parts.join(', ');
    }).filter(Boolean);

    if (labels.length > 0) {
        return labels.join(' / ');
    }

    const applicantRequirements = Array.isArray(schema?.applicantLocationRequirements)
        ? schema.applicantLocationRequirements
        : [schema?.applicantLocationRequirements].filter(Boolean);
    const applicantLabels = applicantRequirements.map((entry) => {
        if (typeof entry === 'string') {
            return normalizeWhitespace(entry);
        }

        const name = entry?.name || entry?.address?.addressCountry;
        return normalizeWhitespace(name || '');
    }).filter(Boolean);

    return applicantLabels.join(' / ');
};

const extractLocationFromText = (text) => {
    const remoteMatch = text.match(/\b(remote|worldwide|distributed)\b/i);
    if (remoteMatch) {
        return 'Remote';
    }

    const locationMatch = text.match(/\b(?:location|based in|office in)\s*[:-]\s*([A-Za-z0-9 ,.&/-]{3,80})/i);
    return locationMatch ? normalizeWhitespace(locationMatch[1]) : '';
};

const detectWorkMode = ({ schema, text }) => {
    const schemaRemote = Array.isArray(schema?.jobLocationType)
        ? schema.jobLocationType.join(' ')
        : schema?.jobLocationType || '';
    const searchText = `${schemaRemote} ${text}`;

    for (const entry of WORK_MODE_PATTERNS) {
        if (entry.pattern.test(searchText)) {
            return entry.label;
        }
    }

    return '';
};

const detectEmploymentType = ({ schema, text }) => {
    const schemaType = Array.isArray(schema?.employmentType)
        ? schema.employmentType.join(' ')
        : schema?.employmentType || '';
    const searchText = `${String(schemaType).replace(/_/g, ' ')} ${text}`;

    for (const entry of EMPLOYMENT_TYPE_PATTERNS) {
        if (entry.pattern.test(searchText)) {
            return entry.label;
        }
    }

    return '';
};

const looksLikeDate = (value = '') => {
    return (
        /\b\d{4}-\d{2}-\d{2}\b/.test(value) ||
        /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/.test(value) ||
        /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b/i.test(value)
    );
};

const parseDeadlineString = (rawValue) => {
    const deadlineText = normalizeWhitespace(String(rawValue || ''));
    if (!deadlineText) {
        return { deadlineAt: null, deadlineText: null };
    }

    const isoDateOnlyMatch = deadlineText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateOnlyMatch) {
        return {
            deadlineAt: new Date(`${deadlineText}T23:59:59.999Z`).toISOString(),
            deadlineText,
        };
    }

    const parsed = new Date(deadlineText);
    if (Number.isNaN(parsed.getTime())) {
        return { deadlineAt: null, deadlineText: null };
    }

    if (!/\d{1,2}:\d{2}|\b(?:am|pm)\b/i.test(deadlineText)) {
        const dateOnly = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 23, 59, 59, 999));
        return {
            deadlineAt: dateOnly.toISOString(),
            deadlineText,
        };
    }

    return {
        deadlineAt: parsed.toISOString(),
        deadlineText,
    };
};

const extractDeadlineFromText = (text = '') => {
    const patterns = [
        /(?:apply by|application deadline|applications close(?: on)?|closing date|deadline to apply|posting end date)\s*[:-]?\s*([^.;<]+)/i,
        /(?:valid through|closing on)\s*[:-]?\s*([^.;<]+)/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && looksLikeDate(match[1])) {
            return parseDeadlineString(match[1]);
        }
    }

    return { deadlineAt: null, deadlineText: null };
};

const extractDeadline = ({ schema, text }) => {
    const schemaDeadline = parseDeadlineString(schema?.validThrough || schema?.deadline);
    if (schemaDeadline.deadlineAt) {
        return schemaDeadline;
    }

    return extractDeadlineFromText(text);
};

const buildTimeLeftLabel = (deadlineAt) => {
    if (!deadlineAt) {
        return null;
    }

    const deadlineTime = new Date(deadlineAt).getTime();
    if (Number.isNaN(deadlineTime)) {
        return null;
    }

    const diff = deadlineTime - Date.now();
    if (diff <= 0) {
        return 'Closed';
    }

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < hour) {
        const minutes = Math.max(1, Math.ceil(diff / minute));
        return `${minutes} min left`;
    }

    if (diff < day) {
        const hours = Math.max(1, Math.ceil(diff / hour));
        return `${hours} hr${hours === 1 ? '' : 's'} left`;
    }

    const days = Math.max(1, Math.ceil(diff / day));
    return `${days} day${days === 1 ? '' : 's'} left`;
};

const extractDescriptionSnippet = ({ schema, markdown, text, description }) => {
    const schemaDescription = cleanDescription(schema?.description || '');
    if (schemaDescription) {
        return schemaDescription.slice(0, 320);
    }

    const markdownLines = String(markdown || '')
        .split('\n')
        .map((line) => normalizeWhitespace(line))
        .filter((line) => line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*'));
    const markdownSnippet = markdownLines.find((line) => line.length > 60);
    if (markdownSnippet) {
        return markdownSnippet.slice(0, 320);
    }

    const fallback = firstNonEmpty(description, text);
    return fallback ? fallback.slice(0, 320) : '';
};

const extractRequirements = ({ markdown, $, text }) => {
    const markdownValue = String(markdown || '');
    const markdownLines = markdownValue.split('\n');

    for (let index = 0; index < markdownLines.length; index += 1) {
        const headingLine = markdownLines[index].trim();
        const heading = normalizeWhitespace(headingLine.replace(/^#{1,6}\s*/, ''));
        if (!REQUIREMENT_HEADING_PATTERN.test(heading)) {
            continue;
        }

        const items = [];
        for (let cursor = index + 1; cursor < markdownLines.length; cursor += 1) {
            const currentLine = markdownLines[cursor].trim();

            if (!currentLine) {
                continue;
            }

            if (/^#{1,6}\s/.test(currentLine)) {
                break;
            }

            if (/^[-*•]\s+/.test(currentLine)) {
                items.push(normalizeWhitespace(currentLine.replace(/^[-*•]\s+/, '')));
            }
        }

        if (items.length > 0) {
            return items.slice(0, 6);
        }
    }

    const extracted = [];
    $('h1, h2, h3, h4, strong').each((_, element) => {
        if (extracted.length > 0) {
            return;
        }

        const heading = normalizeWhitespace($(element).text());
        if (!REQUIREMENT_HEADING_PATTERN.test(heading)) {
            return;
        }

        let sibling = $(element).next();
        while (sibling.length && extracted.length < 6) {
            const tagName = sibling.get(0)?.tagName?.toLowerCase() || '';
            if (/^h[1-6]$/.test(tagName)) {
                break;
            }

            if (tagName === 'ul' || tagName === 'ol') {
                sibling.find('li').each((__, item) => {
                    if (extracted.length < 6) {
                        const itemText = normalizeWhitespace($(item).text());
                        if (itemText) {
                            extracted.push(itemText);
                        }
                    }
                });
            }

            sibling = sibling.next();
        }
    });

    if (extracted.length > 0) {
        return extracted;
    }

    const textRequirements = text.match(/(?:requirements|qualifications)\s*[:-]\s*([^.;]+)/i);
    if (textRequirements) {
        return textRequirements[1]
            .split(/,|•/)
            .map((entry) => normalizeWhitespace(entry))
            .filter(Boolean)
            .slice(0, 6);
    }

    return [];
};

const pageLooksClosed = ({ text, deadlineAt }) => {
    if (CLOSED_PATTERNS.some((pattern) => pattern.test(text))) {
        return true;
    }

    if (!deadlineAt) {
        return false;
    }

    const deadlineTime = new Date(deadlineAt).getTime();
    return !Number.isNaN(deadlineTime) && deadlineTime <= Date.now();
};

const pageHasApplySignal = ({ $, text, links }) => {
    if (APPLY_TEXT_PATTERN.test(text)) {
        return true;
    }

    let hasSignal = false;
    $('a, button, input[type="submit"], input[type="button"]').each((_, element) => {
        if (hasSignal) {
            return;
        }

        const value = normalizeWhitespace($(element).text() || $(element).attr('value') || '');
        if (APPLY_TEXT_PATTERN.test(value)) {
            hasSignal = true;
        }
    });

    if (hasSignal) {
        return true;
    }

    return Array.isArray(links) && links.some((entry) => APPLY_TEXT_PATTERN.test(String(entry?.text || entry || '')));
};

const chooseApplyUrl = ({ $, sourceUrl, links, schema }) => {
    const sourceHostname = getHostname(sourceUrl);
    const candidates = [];

    const pushCandidate = (value) => {
        const normalized = normalizePossibleUrl(value, sourceUrl);
        if (normalized) {
            candidates.push(normalized);
        }
    };

    pushCandidate(schema?.url);

    $('a, form').each((_, element) => {
        const tagName = element.tagName?.toLowerCase();
        const label = normalizeWhitespace($(element).text() || $(element).attr('aria-label') || $(element).attr('title') || '');
        const href = $(element).attr('href');
        const action = $(element).attr('action');

        if (APPLY_TEXT_PATTERN.test(label)) {
            pushCandidate(href || action || sourceUrl);
        } else if (tagName === 'form' && (action || APPLY_TEXT_PATTERN.test($(element).html() || ''))) {
            pushCandidate(action || sourceUrl);
        }
    });

    if (Array.isArray(links)) {
        links.forEach((entry) => {
            const href = typeof entry === 'string' ? entry : entry?.url || entry?.href || '';
            const label = normalizeWhitespace(typeof entry === 'string' ? entry : entry?.text || '');
            if (APPLY_TEXT_PATTERN.test(label) || /apply|application/i.test(href)) {
                pushCandidate(href);
            }
        });
    }

    pushCandidate(sourceUrl);

    return candidates.find((candidate) => {
        const hostname = getHostname(candidate);
        return isAllowedApplyHost(hostname, sourceHostname);
    }) || '';
};

const pageLooksLikeJob = ({ sourceUrl, schema, title, applyUrl, text }) => {
    const sourceHostname = getHostname(sourceUrl);
    const isTrustedAts = Boolean(detectTrustedAtsProvider(sourceHostname));

    if (looksLikeBlockedHost(sourceHostname)) {
        return false;
    }

    if (!title || !applyUrl) {
        return false;
    }

    if (schema) {
        return true;
    }

    if (isTrustedAts) {
        return true;
    }

    return JOB_PATH_PATTERN.test(sourceUrl) || JOB_PATH_PATTERN.test(text);
};

const buildVerifiedJobId = ({ company, title, applyUrl }) => {
    return Buffer.from(`${company}|${title}|${applyUrl}`).toString('base64url').slice(0, 32);
};

const buildTrustedAtsFallbackJob = ({ result, sourceUrl, sourceHostname, text }) => {
    if (!isTrustedAtsHost(sourceHostname)) {
        return null;
    }

    if (pageLooksClosed({ text, deadlineAt: null })) {
        return null;
    }

    const title = firstNonEmpty(
        normalizeWhitespace(result?.title || '').split(/[|—–-]/)[0],
        normalizeWhitespace(result?.metadata?.title || ''),
    );
    const company = firstNonEmpty(
        extractCompanyFromResult(result?.title || '', sourceHostname),
        sourceHostname.replace(/^www\./, ''),
    );

    if (!title || !company) {
        return null;
    }

    const descriptionSnippet = firstNonEmpty(
        cleanDescription(result?.description || ''),
        text,
    );

    return {
        id: buildVerifiedJobId({ company, title, applyUrl: sourceUrl }),
        title,
        company,
        location: extractLocationFromText(text) || null,
        employmentType: detectEmploymentType({ schema: null, text }) || null,
        workMode: detectWorkMode({ schema: null, text }) || null,
        applyUrl: sourceUrl,
        sourceUrl,
        sourceProvider: getSourceProvider(sourceHostname),
        deadlineAt: null,
        deadlineText: null,
        timeLeftLabel: null,
        descriptionSnippet: descriptionSnippet ? descriptionSnippet.slice(0, 320) : null,
        requirements: [],
    };
};

export const extractVerifiedJob = (result) => {
    const sourceUrl = normalizeJobLink(result?.url || result?.sourceUrl);
    if (!sourceUrl) {
        return null;
    }

    const sourceHostname = getHostname(sourceUrl);
    if (looksLikeBlockedHost(sourceHostname)) {
        return null;
    }
    const trustedAts = isTrustedAtsHost(sourceHostname);

    const html = typeof result?.html === 'string' ? result.html : '';
    const markdown = typeof result?.markdown === 'string' ? result.markdown : '';
    const description = cleanDescription(result?.description || '');
    const $ = load(html || '<html></html>');
    const schema = extractJobPostingSchema($);
    const text = normalizeWhitespace([
        cleanDescription(markdown),
        description,
        cleanDescription($('body').text()),
        cleanDescription(schema?.description || ''),
    ].filter(Boolean).join(' '));

    const title = firstNonEmpty(
        normalizeWhitespace(schema?.title || ''),
        normalizeWhitespace($('h1').first().text()),
        normalizeWhitespace(result?.title || '').split(/[|—–-]/)[0],
    );
    const company = firstNonEmpty(
        normalizeWhitespace(schema?.hiringOrganization?.name || ''),
        getMetaContent($, 'meta[property="og:site_name"]'),
        extractCompanyFromResult(result?.title || '', sourceHostname),
    );
    const applyUrl = chooseApplyUrl({
        $,
        sourceUrl,
        links: Array.isArray(result?.links) ? result.links : [],
        schema,
    });
    const { deadlineAt, deadlineText } = extractDeadline({ schema, text });

    if (pageLooksClosed({ text, deadlineAt })) {
        return null;
    }

    if (!pageHasApplySignal({ $, text, links: result?.links }) && !trustedAts && !schema) {
        return buildTrustedAtsFallbackJob({ result, sourceUrl, sourceHostname, text });
    }

    if (!pageLooksLikeJob({ sourceUrl, schema, title, applyUrl, text })) {
        return buildTrustedAtsFallbackJob({ result, sourceUrl, sourceHostname, text });
    }

    const location = firstNonEmpty(
        extractLocationFromSchema(schema),
        extractLocationFromText(text),
    );
    const workMode = detectWorkMode({ schema, text });
    const employmentType = detectEmploymentType({ schema, text });
    const descriptionSnippet = extractDescriptionSnippet({ schema, markdown, text, description });
    const requirements = extractRequirements({ markdown, $, text });
    const sourceProvider = getSourceProvider(sourceHostname);

    return {
        id: buildVerifiedJobId({ company, title, applyUrl }),
        title,
        company,
        location: location || null,
        employmentType: employmentType || null,
        workMode: workMode || null,
        applyUrl,
        sourceUrl,
        sourceProvider,
        deadlineAt: deadlineAt || null,
        deadlineText: deadlineText || null,
        timeLeftLabel: buildTimeLeftLabel(deadlineAt),
        descriptionSnippet: descriptionSnippet || null,
        requirements,
    };
};

const dedupeQueries = (queries) => Array.from(new Set(queries.map((entry) => normalizeWhitespace(entry)).filter(Boolean)));

export const buildSearchQueries = ({ role, location }) => {
    const normalizedRole = normalizeWhitespace(role || '');
    const normalizedLocation = normalizeWhitespace(location || '');
    const searchTopic = normalizedRole || 'open jobs';
    const careersTopic = normalizedRole || 'open roles';
    const terms = [searchTopic, normalizedLocation, 'job opening', 'apply', 'careers']
        .filter(Boolean)
        .join(' ');

    const exclusions = [
        '-site:linkedin.com',
        '-site:indeed.com',
        '-site:glassdoor.com',
        '-site:ziprecruiter.com',
        '-site:monster.com',
        '-site:careerbuilder.com',
        '-site:simplyhired.com',
        '-site:talent.com',
    ].join(' ');

    const atsQueries = TRUSTED_ATS_SEARCH_SITES.map((site) => [
        searchTopic,
        normalizedLocation,
        `site:${site}`,
        'careers',
        'apply',
    ].filter(Boolean).join(' '));

    return dedupeQueries([
        ...atsQueries,
        `${searchTopic} ${normalizedLocation} job opening apply ${exclusions}`,
        `${careersTopic} ${normalizedLocation} official careers apply ${exclusions}`,
        `${terms} ${exclusions}`,
    ]);
};

const firecrawlRequest = async ({ apiKey, path, body }) => {
    const response = await fetch(`${FIRECRAWL_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload?.error || `Firecrawl request failed (${response.status})`);
    }

    return payload;
};

const scrapeCandidateIfNeeded = async ({ candidate, apiKey }) => {
    if (candidate?.html || candidate?.markdown) {
        return candidate;
    }

    const scraped = await firecrawlRequest({
        apiKey,
        path: '/scrape',
        body: {
            url: candidate.url,
            formats: ['html', 'markdown', 'links'],
        },
    });

    return {
        ...candidate,
        ...(scraped?.data || {}),
        url: candidate.url,
        title: candidate.title,
        description: candidate.description,
    };
};

export const searchVerifiedJobs = async ({ apiKey, role, location, workMode = 'All', employmentType = 'All', limit = 18 }) => {
    const queries = buildSearchQueries({ role, location });
    const seenCandidateUrls = new Set();
    const seenApplyUrls = new Set();
    const verifiedJobs = [];

    for (const query of queries) {
        const searchPayload = await firecrawlRequest({
            apiKey,
            path: '/search',
            body: {
                query,
                limit: Math.min(Math.max(limit * 4, 24), 48),
                scrapeOptions: {
                    formats: ['html', 'markdown', 'links'],
                },
            },
        });

        const rawResults = Array.isArray(searchPayload?.data)
            ? searchPayload.data
            : Array.isArray(searchPayload?.results)
                ? searchPayload.results
                : [];

        const uniqueCandidates = rawResults.filter((candidate) => {
            const normalizedUrl = normalizeJobLink(candidate?.url);
            if (!normalizedUrl || seenCandidateUrls.has(normalizedUrl)) {
                return false;
            }

            seenCandidateUrls.add(normalizedUrl);
            return true;
        });

        const hydrated = await Promise.all(uniqueCandidates.map((candidate) => scrapeCandidateIfNeeded({ candidate, apiKey })));

        for (const candidate of hydrated) {
            const verified = extractVerifiedJob(candidate);
            if (!verified) {
                continue;
            }

            if (workMode !== 'All' && verified.workMode !== workMode) {
                continue;
            }

            if (employmentType !== 'All' && verified.employmentType !== employmentType) {
                continue;
            }

            if (seenApplyUrls.has(verified.applyUrl)) {
                continue;
            }

            seenApplyUrls.add(verified.applyUrl);
            verifiedJobs.push(verified);

            if (verifiedJobs.length >= limit) {
                return verifiedJobs;
            }
        }
    }

    return verifiedJobs;
};
