const FIRECRAWL_API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;

/**
 * Search jobs using Firecrawl API
 * @param {string} query - The search query (e.g. "Frontend Developer in New York")
 * @returns {Promise<Array>} List of job results
 */
export const searchJobs = async (query) => {
    if (!FIRECRAWL_API_KEY) {
        console.warn("Firecrawl API key is missing.");
        // Mock data for demo if key is missing
        return [
            { title: "Senior React Developer", company: "TechCorp", location: "Remote", link: "https://example.com/job1", score: 95 },
            { title: "Frontend Engineer", company: "Innova", location: "San Francisco", link: "https://example.com/job2", score: 88 },
            { title: "UI Developer", company: "Designly", location: "New York", link: "https://example.com/job3", score: 82 }
        ];
    }

    try {
        const response = await fetch("https://api.firecrawl.dev/v1/search", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `${query} job postings site:linkedin.com site:indeed.com site:glassdoor.com`,
                limit: 10,
                scrapeOptions: {
                    formats: ["json"]
                }
            })
        });

        if (!response.ok) {
            throw new Error("Firecrawl search failed");
        }

        const data = await response.json();
        // Process data into a standard job format
        return data.results.map(res => ({
            title: res.title,
            company: res.metadata?.hostname || "Unknown",
            location: "N/A",
            link: res.url,
            score: Math.floor(Math.random() * 20) + 80 // Mock score for now
        }));

    } catch (error) {
        console.error("Firecrawl API Error:", error);
        throw error;
    }
};
