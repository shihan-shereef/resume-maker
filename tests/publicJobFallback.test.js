import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePublicGreenhouseJob, searchJobs, searchJobsWithMeta } from '../src/lib/firecrawl.js';

test('normalizePublicGreenhouseJob maps a public Greenhouse board listing', () => {
    const job = normalizePublicGreenhouseJob('vercel', {
        id: 123,
        title: 'Frontend Engineer',
        company_name: 'Vercel',
        absolute_url: 'https://job-boards.greenhouse.io/vercel/jobs/123',
        updated_at: '2026-03-18T10:00:00Z',
        location: {
            name: 'Hybrid - San Francisco, CA',
        },
        metadata: [
            { name: 'Type', value: 'Full-time' },
        ],
    });

    assert.ok(job);
    assert.equal(job.id, 'gh-123');
    assert.equal(job.company, 'Vercel');
    assert.equal(job.title, 'Frontend Engineer');
    assert.equal(job.applyUrl, 'https://job-boards.greenhouse.io/vercel/jobs/123');
    assert.equal(job.sourceProvider, 'Greenhouse');
    assert.equal(job.workMode, 'Hybrid');
    assert.equal(job.employmentType, 'Full-time');
    assert.equal(job.deadlineAt, null);
});

test('searchJobs falls back to public Greenhouse jobs when API routes fail', async (context) => {
    const originalFetch = globalThis.fetch;
    context.after(() => {
        globalThis.fetch = originalFetch;
    });

    globalThis.fetch = async (url) => {
        const target = String(url);

        if (target.startsWith('/api/')) {
            return new Response('<html>Not found</html>', {
                status: 405,
                headers: {
                    'content-type': 'text/html',
                },
            });
        }

        if (target.includes('boards-api.greenhouse.io/v1/boards/stripe/jobs')) {
            return new Response(JSON.stringify({
                jobs: [
                    {
                        id: 7532733,
                        title: 'Account Executive, AI Sales',
                        company_name: 'Stripe',
                        absolute_url: 'https://stripe.com/jobs/search?gh_jid=7532733',
                        updated_at: '2026-03-17T17:31:19-04:00',
                        location: { name: 'San Francisco, CA' },
                        metadata: [],
                    },
                ],
            }), {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });
    };

    const jobs = await searchJobs({
        role: '',
        location: '',
        filters: {
            workMode: 'All',
            employmentType: 'All',
        },
        limit: 5,
    });

    assert.equal(jobs.length, 1);
    assert.equal(jobs[0].company, 'Stripe');
    assert.equal(jobs[0].sourceProvider, 'Greenhouse');
    assert.equal(jobs[0].applyUrl, 'https://stripe.com/jobs/search?gh_jid=7532733');
});

test('searchJobsWithMeta broadens to available live jobs when an exact company search has no public match', async (context) => {
    const originalFetch = globalThis.fetch;
    context.after(() => {
        globalThis.fetch = originalFetch;
    });

    globalThis.fetch = async (url) => {
        const target = String(url);

        if (target.startsWith('/api/')) {
            return new Response(JSON.stringify({
                error: 'Firecrawl API key is not configured.',
                data: [],
            }), {
                status: 500,
                headers: {
                    'content-type': 'application/json',
                },
            });
        }

        if (target.includes('boards-api.greenhouse.io/v1/boards/stripe/jobs')) {
            return new Response(JSON.stringify({
                jobs: [
                    {
                        id: 7532733,
                        title: 'Account Executive, AI Sales',
                        company_name: 'Stripe',
                        absolute_url: 'https://stripe.com/jobs/search?gh_jid=7532733',
                        updated_at: '2026-03-17T17:31:19-04:00',
                        location: { name: 'San Francisco, CA' },
                        metadata: [],
                    },
                ],
            }), {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ jobs: [] }), {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        });
    };

    const result = await searchJobsWithMeta({
        role: 'google',
        location: '',
        filters: {
            workMode: 'All',
            employmentType: 'All',
        },
        limit: 5,
    });

    assert.equal(result.jobs.length, 1);
    assert.equal(result.jobs[0].company, 'Stripe');
    assert.match(result.notice, /No exact live matches were found/i);
    assert.equal(result.errorMessage, '');
});
