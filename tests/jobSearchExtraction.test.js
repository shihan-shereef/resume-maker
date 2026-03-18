import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchQueries, extractVerifiedJob } from '../api/_lib/verifiedJobs.js';

test('extracts a live Greenhouse job with deadline and requirements', () => {
    const result = extractVerifiedJob({
        url: 'https://boards.greenhouse.io/example/jobs/12345',
        title: 'Senior Frontend Engineer | Example',
        description: 'Build user-facing experiences for a growing product team.',
        html: `
            <html>
                <head>
                    <script type="application/ld+json">
                        {
                            "@context": "https://schema.org",
                            "@type": "JobPosting",
                            "title": "Senior Frontend Engineer",
                            "employmentType": "FULL_TIME",
                            "validThrough": "2030-02-20",
                            "description": "Build user-facing experiences for a growing product team.",
                            "hiringOrganization": {
                                "@type": "Organization",
                                "name": "Example"
                            },
                            "jobLocation": {
                                "@type": "Place",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "San Francisco",
                                    "addressRegion": "CA",
                                    "addressCountry": "US"
                                }
                            }
                        }
                    </script>
                </head>
                <body>
                    <h1>Senior Frontend Engineer</h1>
                    <a href="https://boards.greenhouse.io/example/jobs/12345/apply">Apply for this job</a>
                    <h2>Requirements</h2>
                    <ul>
                        <li>React expertise</li>
                        <li>System design experience</li>
                    </ul>
                </body>
            </html>
        `,
        markdown: `
# Senior Frontend Engineer

Build user-facing experiences for a growing product team.

## Requirements
- React expertise
- System design experience
        `,
        links: [
            { text: 'Apply for this job', url: 'https://boards.greenhouse.io/example/jobs/12345/apply' },
        ],
    });

    assert.ok(result);
    assert.equal(result.sourceProvider, 'Greenhouse');
    assert.equal(result.company, 'Example');
    assert.equal(result.title, 'Senior Frontend Engineer');
    assert.equal(result.location, 'San Francisco, CA, US');
    assert.equal(result.employmentType, 'Full-time');
    assert.equal(result.applyUrl, 'https://boards.greenhouse.io/example/jobs/12345/apply');
    assert.equal(result.deadlineText, '2030-02-20');
    assert.deepEqual(result.requirements, ['React expertise', 'System design experience']);
});

test('rejects closed jobs even when the page still exists', () => {
    const result = extractVerifiedJob({
        url: 'https://jobs.example.com/careers/backend-engineer',
        title: 'Backend Engineer | Example',
        html: `
            <html>
                <body>
                    <h1>Backend Engineer</h1>
                    <p>This job is no longer accepting applications.</p>
                    <a href="https://jobs.example.com/apply/backend-engineer">Apply now</a>
                </body>
            </html>
        `,
        markdown: `
# Backend Engineer

This job is no longer accepting applications.
        `,
        links: [
            { text: 'Apply now', url: 'https://jobs.example.com/apply/backend-engineer' },
        ],
    });

    assert.equal(result, null);
});

test('keeps live company career pages with no listed deadline', () => {
    const result = extractVerifiedJob({
        url: 'https://careers.example.com/jobs/product-designer',
        title: 'Product Designer - Example',
        description: 'Shape the user journey across our platform.',
        html: `
            <html>
                <head>
                    <meta property="og:site_name" content="Example" />
                </head>
                <body>
                    <h1>Product Designer</h1>
                    <p>Location: Remote</p>
                    <a href="https://careers.example.com/jobs/product-designer/apply">Apply now</a>
                    <h2>Qualifications</h2>
                    <ul>
                        <li>Portfolio of shipped products</li>
                        <li>Strong prototyping skills</li>
                    </ul>
                </body>
            </html>
        `,
        markdown: `
# Product Designer

Shape the user journey across our platform.

## Qualifications
- Portfolio of shipped products
- Strong prototyping skills
        `,
        links: [
            { text: 'Apply now', url: 'https://careers.example.com/jobs/product-designer/apply' },
        ],
    });

    assert.ok(result);
    assert.equal(result.sourceProvider, 'Company website');
    assert.equal(result.deadlineAt, null);
    assert.equal(result.location, 'Remote');
    assert.equal(result.applyUrl, 'https://careers.example.com/jobs/product-designer/apply');
});

test('rejects blocked aggregator domains', () => {
    const result = extractVerifiedJob({
        url: 'https://www.linkedin.com/jobs/view/123',
        title: 'Frontend Engineer - Example',
        description: 'Aggregator listing',
        html: '<html><body><h1>Frontend Engineer</h1><a href="https://www.linkedin.com/jobs/view/123">Apply</a></body></html>',
        markdown: '# Frontend Engineer',
        links: ['https://www.linkedin.com/jobs/view/123'],
    });

    assert.equal(result, null);
});

test('keeps trusted ATS listings even when the page markup is sparse', () => {
    const result = extractVerifiedJob({
        url: 'https://jobs.lever.co/example/abcd1234',
        title: 'Backend Platform Engineer | Example',
        description: 'Design internal systems and platform services.',
        html: `
            <html>
                <body>
                    <div id="app-root"></div>
                </body>
            </html>
        `,
        markdown: 'Backend Platform Engineer',
        links: [],
    });

    assert.ok(result);
    assert.equal(result.sourceProvider, 'Lever');
    assert.equal(result.applyUrl, 'https://jobs.lever.co/example/abcd1234');
    assert.equal(result.title, 'Backend Platform Engineer');
});

test('builds broad ATS queries when the role is blank', () => {
    const queries = buildSearchQueries({
        role: '',
        location: '',
    });

    assert.ok(queries.length >= 5);
    assert.ok(queries.some((query) => query.includes('site:greenhouse.io')));
    assert.ok(queries.some((query) => query.includes('site:lever.co')));
    assert.ok(queries.some((query) => query.includes('site:ashbyhq.com')));
    assert.ok(queries.some((query) => query.includes('site:myworkdayjobs.com')));
    assert.ok(queries.some((query) => query.includes('official careers apply')));
    assert.ok(queries.every((query) => query.includes('open jobs') || query.includes('open roles')));
});
