import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

/**
 * Vite plugin that handles /api/github-proxy in local dev.
 * This mirrors the Vercel serverless function at api/github-proxy.js
 * so that npm run dev works without needing vercel dev.
 */
function githubProxyPlugin(env) {
  const SUPPORTED_EXTENSIONS = [
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
    'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'sql', 'html', 'css',
    'json', 'md', 'sh', 'yml', 'yaml',
  ];

  return {
    name: 'github-proxy',
    configureServer(server) {
      server.middlewares.use('/api/github-proxy', async (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const owner = url.searchParams.get('owner');
        const repo = url.searchParams.get('repo');

        if (!owner || !repo) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'owner and repo are required' }));
        }

        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Takshila-AI-Code-Review',
        };

        // Use VITE_GITHUB_TOKEN if available — but not required
        const token = env.VITE_GITHUB_TOKEN;
        if (token) headers['Authorization'] = `token ${token}`;

        try {
          // Step 1: Get default branch
          const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
          if (!repoRes.ok) {
            const err = await repoRes.json().catch(() => ({}));
            res.statusCode = repoRes.status;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message || 'Failed to fetch repo info' }));
          }
          const repoData = await repoRes.json();
          const defaultBranch = repoData.default_branch || 'main';

          // Step 2: One single recursive tree request
          const treeRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
            { headers }
          );
          if (!treeRes.ok) {
            const err = await treeRes.json().catch(() => ({}));
            res.statusCode = treeRes.status;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message || 'Failed to fetch tree' }));
          }
          const treeData = await treeRes.json();

          const files = (treeData.tree || [])
            .filter(item => {
              if (item.type !== 'blob') return false;
              const ext = item.path.split('.').pop().toLowerCase();
              const notVendor = !['node_modules', 'vendor', 'dist', 'build', '.next'].some(d => item.path.includes(d));
              const notHidden = !item.path.split('/').some(p => p.startsWith('.'));
              return SUPPORTED_EXTENSIONS.includes(ext) && notVendor && notHidden;
            })
            .map(item => ({
              name: item.path.split('/').pop(),
              path: item.path,
              size: item.size,
              download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${item.path}`,
            }))
            .slice(0, 100);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ files, defaultBranch }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      githubProxyPlugin(env),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
