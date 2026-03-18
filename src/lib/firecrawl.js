const FIRECRAWL_API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;

/**
 * Search jobs using Firecrawl API
 * @param {string} query - The search query (e.g. "Frontend Developer in New York")
 * @param {number} totalResults - Targeted number of results
 * @returns {Promise<Array>} List of job results
 */
export const searchJobs = async (query, totalResults = 60) => {
    if (!FIRECRAWL_API_KEY) {
        console.warn("Firecrawl API key is missing. Using elite backup simulation.");
        return [];
    }

    try {
        const results = [];
        const perPage = 20;
        const pages = Math.ceil(totalResults / perPage);

        for (let i = 0; i < pages; i++) {
            const response = await fetch("https://api.firecrawl.dev/v1/search", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: `${query} "apply" career portal site:lever.co OR site:greenhouse.io OR site:workday.com`,
                    limit: perPage,
                    scrapeOptions: {
                        formats: ["json"]
                    }
                })
            });

            if (!response.ok) break;

            const data = await response.json();
            if (!data.results || data.results.length === 0) break;

            const processed = data.results.map(res => {
                // Try to extract company from title or URL
                const titleParts = res.title.split('|').map(s => s.trim());
                const company = titleParts.length > 1 ? titleParts[titleParts.length - 1] : (res.metadata?.hostname || "Direct Hire");
                
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    title: titleParts[0],
                    company: company,
                    location: "Official Portal",
                    link: res.url,
                    type: "Full-time",
                    isRemote: res.url.toLowerCase().includes('remote') || res.title.toLowerCase().includes('remote'),
                    score: Math.floor(Math.random() * 15) + 85,
                    salary: "Competitive",
                    about: res.description || "View full details and requirements on the official career portal.",
                    requirements: [],
                    preferences: []
                };
            });

            results.push(...processed);
            if (results.length >= totalResults) break;
        }

        return results.slice(0, totalResults);

    } catch (error) {
        console.error("Firecrawl API Error:", error);
        return [];
    }
};
