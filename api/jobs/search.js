/* global process */
import { z } from 'zod';
import { searchVerifiedJobs } from '../_lib/verifiedJobs.js';

const SearchBodySchema = z.object({
    role: z.string().max(160).optional().default(''),
    location: z.string().max(160).optional().default(''),
    filters: z.object({
        workMode: z.enum(['All', 'Remote', 'Hybrid', 'On-site']).optional().default('All'),
        employmentType: z.enum(['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']).optional().default('All'),
    }).optional().default({}),
    limit: z.number().int().min(1).max(30).optional().default(18),
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const { role, location, filters, limit } = SearchBodySchema.parse(req.body);
        const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || process.env.VITE_FIRECRAWL_API_KEY;

        if (!firecrawlApiKey) {
            return res.status(500).json({ error: 'Firecrawl API key is not configured.', data: [] });
        }

        const jobs = await searchVerifiedJobs({
            apiKey: firecrawlApiKey,
            role,
            location,
            workMode: filters.workMode || 'All',
            employmentType: filters.employmentType || 'All',
            limit,
        });

        return res.status(200).json({ data: jobs });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid search request.', details: error.errors, data: [] });
        }

        console.error('Verified job search failed:', error);
        return res.status(502).json({
            error: error?.message || 'Unable to load live verified jobs right now.',
            data: [],
        });
    }
}
