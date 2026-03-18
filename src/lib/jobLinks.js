const ABSOLUTE_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/;
const LIKELY_DOMAIN_PATTERN = /^(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:[/?#].*)?$/;

export const normalizeJobLink = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }

    const lowerValue = trimmed.toLowerCase();
    if (
        lowerValue === 'about:blank' ||
        lowerValue === 'about:srcdoc' ||
        lowerValue.startsWith('javascript:') ||
        lowerValue.startsWith('data:') ||
        lowerValue.startsWith('vbscript:') ||
        lowerValue.startsWith('file:')
    ) {
        return '';
    }

    let candidate = '';
    if (trimmed.startsWith('//')) {
        candidate = `https:${trimmed}`;
    } else if (ABSOLUTE_PROTOCOL_PATTERN.test(trimmed)) {
        candidate = trimmed;
    } else if (LIKELY_DOMAIN_PATTERN.test(trimmed)) {
        candidate = `https://${trimmed}`;
    }

    if (!candidate) {
        return '';
    }

    try {
        const parsed = new URL(candidate);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : '';
    } catch {
        return '';
    }
};

export const hasDirectJobApplicationLink = (job) => Boolean(getJobApplicationUrl(job));

export const getJobApplicationUrl = (job) => {
    return normalizeJobLink(job?.applyUrl || job?.link);
};

export const getJobApplicationDestinationLabel = (job) => {
    const directLink = getJobApplicationUrl(job);

    if (directLink) {
        try {
            return new URL(directLink).hostname.replace(/^www\./, '');
        } catch {
            return 'official application page';
        }
    }

    return 'verified application page';
};

export const openJobApplication = (job) => {
    const destination = getJobApplicationUrl(job);
    if (!destination) {
        return '';
    }

    const openedWindow = window.open(destination, '_blank', 'noopener,noreferrer');

    if (openedWindow) {
        openedWindow.opener = null;
        return destination;
    }

    // Safari and in-app browsers can block the new tab even on click.
    // Fall back to same-tab navigation so the user can still apply.
    window.location.assign(destination);

    return destination;
};

export const formatJobDeadline = (deadlineAt) => {
    if (!deadlineAt) {
        return 'Not listed';
    }

    const parsed = new Date(deadlineAt);
    if (Number.isNaN(parsed.getTime())) {
        return 'Not listed';
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsed);
};

export const getTimeLeftLabel = (deadlineAt, now = Date.now()) => {
    if (!deadlineAt) {
        return 'Not listed';
    }

    const deadlineTime = new Date(deadlineAt).getTime();
    if (Number.isNaN(deadlineTime)) {
        return 'Not listed';
    }

    const diff = deadlineTime - now;
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
