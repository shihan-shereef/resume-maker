/**
 * Service to interact with GitHub API for fetching repository contents.
 * Uses a server-side proxy (/api/github-proxy) in production to bypass
 * browser-based rate limits. Falls back to direct API in development.
 */

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Supported code file extensions for analysis.
 */
const SUPPORTED_EXTENSIONS = [
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
    'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'sql', 'html', 'css',
    'json', 'md', 'sh', 'yml', 'yaml'
];

/**
 * Headers for direct (browser-side) GitHub API calls.
 */
const getDirectHeaders = () => {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers['Authorization'] = `token ${token}`;
    return headers;
};

/**
 * Fetch contents of a public GitHub repository.
 * Automatically uses the server-side proxy for higher rate limits.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array>} - Flattened list of files with their path and download_url
 */
export const fetchRepoContents = async (owner, repo) => {
    try {
        // Use the server-side proxy (works in both npm run dev via Vite middleware and Vercel)
        const proxyUrl = `/api/github-proxy?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;
        const proxyRes = await fetch(proxyUrl);

        // If the proxy responded (even with an error from GitHub), use that response
        if (proxyRes.status !== 404) {
            const data = await proxyRes.json();
            if (!proxyRes.ok) {
                // Proxy itself got an error from GitHub (e.g. repo not found, rate limit on server)
                throw new Error(data.error || `GitHub API error: ${proxyRes.status}`);
            }
            if (data.files) return data.files;
        }

        // 404 means the proxy route doesn't exist yet — fall back to direct (very rare)
        console.warn('Proxy route not found, using direct GitHub API...');
        return await fetchRepoContentsDirect(owner, repo);

    } catch (error) {
        // If the error came from our proxy throw above, re-throw it directly
        if (!(error instanceof TypeError)) throw error;
        // TypeError = network error / proxy not up, try direct
        console.warn('Proxy network error, trying direct GitHub API:', error.message);
        return await fetchRepoContentsDirect(owner, repo);
    }
};

/**
 * Direct GitHub API fetch (fallback, subject to 60 req/hr limit without a token).
 */
const fetchRepoContentsDirect = async (owner, repo) => {
    const headers = getDirectHeaders();

    // Step 1: Resolve default branch
    const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
        const err = await repoRes.json();
        if (repoRes.status === 403 || repoRes.status === 429) {
            throw new Error('GitHub API rate limit exceeded. Please try again in an hour or add VITE_GITHUB_TOKEN to your .env file.');
        }
        throw new Error(err.message || `Cannot access repo: ${repoRes.status}`);
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || 'main';

    // Step 2: Single recursive tree fetch (far fewer requests than recursive dir calls)
    const treeRes = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
        { headers }
    );

    if (!treeRes.ok) {
        const err = await treeRes.json();
        if (treeRes.status === 403 || treeRes.status === 429) {
            throw new Error('GitHub API rate limit exceeded. Please use vercel dev locally or try again later.');
        }
        throw new Error(err.message || `Failed to fetch repo tree: ${treeRes.status}`);
    }

    const treeData = await treeRes.json();

    return (treeData.tree || [])
        .filter(item => {
            if (item.type !== 'blob') return false;
            const ext = item.path.split('.').pop().toLowerCase();
            const isSupported = SUPPORTED_EXTENSIONS.includes(ext);
            const isNotHidden = !item.path.split('/').some(p => p.startsWith('.'));
            const isNotVendor = !['node_modules', 'vendor', 'dist', 'build', '.next'].some(d => item.path.includes(d));
            return isSupported && isNotHidden && isNotVendor;
        })
        .map(item => ({
            name: item.path.split('/').pop(),
            path: item.path,
            size: item.size,
            download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${item.path}`
        }))
        .slice(0, 100);
};

/**
 * Fetch the actual content of a file from GitHub (raw URL, no auth needed, no rate limit).
 * @param {string} downloadUrl - raw.githubusercontent.com URL
 * @returns {Promise<string>} - The text content of the file
 */
export const fetchFileContent = async (downloadUrl) => {
    try {
        // Raw GitHub content URLs don't count against the API rate limit
        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch file content: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching file content:', error);
        throw error;
    }
};

/**
 * Parse GitHub URL to extract owner and repo name.
 * Supports: https://github.com/owner/repo, github.com/owner/repo, owner/repo
 * @param {string} url - The GitHub URL or slug
 * @returns {Object|null} - { owner, repo } or null if invalid
 */
export const parseGitHubUrl = (url) => {
    if (!url) return null;
    const cleanUrl = url.replace(/\/$/, '').replace(/\.git$/, '');
    const gitHubPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+)|^([^/\s]+)\/([^/\s]+)$/;
    const match = cleanUrl.match(gitHubPattern);
    if (match) {
        if (match[1] && match[2]) return { owner: match[1], repo: match[2] };
        if (match[3] && match[4]) return { owner: match[3], repo: match[4] };
    }
    return null;
};
