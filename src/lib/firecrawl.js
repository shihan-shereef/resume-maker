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

            return Array.isArray(payload?.data) ? payload.data : [];
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unable to load live verified jobs right now.');
        }
    }

    throw lastError;
};
