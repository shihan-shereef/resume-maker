/* global process */
/**
 * Vercel Serverless Function: GitHub API Proxy
 * This proxies GitHub API calls through the server, which has a much higher rate limit
 * and can use a Personal Access Token without exposing it to the browser.
 */

export default async function handler(req, res) {
    // Only accept GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { owner, repo } = req.query;
    if (!owner || !repo) {
        return res.status(400).json({ error: 'Owner and repo are required.' });
    }

    // Build common headers with optional GitHub Personal Access Token
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Takshila-AI-Code-Review',
    };

    // If a GitHub token is configured, use it for a higher rate limit (5000/hr vs 60/hr)
    const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        // Step 1: Get repo info to determine the default branch
        const repoInfoRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            { headers }
        );

        if (!repoInfoRes.ok) {
            const err = await repoInfoRes.json();
            return res.status(repoInfoRes.status).json({ 
                error: err.message || 'Failed to fetch repo info' 
            });
        }

        const repoInfo = await repoInfoRes.json();
        const defaultBranch = repoInfo.default_branch || 'main';

        // Step 2: Fetch entire tree recursively in one API call
        const treeRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
            { headers }
        );

        if (!treeRes.ok) {
            const err = await treeRes.json();
            return res.status(treeRes.status).json({ 
                error: err.message || 'Failed to fetch repo tree' 
            });
        }

        const treeData = await treeRes.json();

        // Supported code file extensions
        const SUPPORTED_EXTENSIONS = [
            'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
            'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'sql', 'html', 'css',
            'json', 'md', 'sh', 'yml', 'yaml'
        ];

        // Filter out unsupported files, hidden directories, and vendor code
        const files = (treeData.tree || [])
            .filter(item => {
                if (item.type !== 'blob') return false;
                const ext = item.path.split('.').pop().toLowerCase();
                const isSupported = SUPPORTED_EXTENSIONS.includes(ext);
                const isNotHidden = !item.path.split('/').some(p => p.startsWith('.'));
                const isNotVendor = !item.path.includes('node_modules') && !item.path.includes('vendor') && !item.path.includes('dist') && !item.path.includes('build');
                return isSupported && isNotHidden && isNotVendor;
            })
            .map(item => ({
                name: item.path.split('/').pop(),
                path: item.path,
                size: item.size,
                // Use raw.githubusercontent.com for file content — no auth needed, no rate limit
                download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${item.path}`
            }))
            .slice(0, 100); // Cap at 100 files

        return res.status(200).json({
            files,
            defaultBranch,
            totalFound: treeData.tree ? treeData.tree.length : 0
        });

    } catch (error) {
        console.error('GitHub Proxy Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
