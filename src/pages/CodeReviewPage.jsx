import React, { useState } from 'react';
import { Terminal, Search, Sparkles, Github, Code, FileCode, AlertTriangle, CheckCircle, Info, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseGitHubUrl, fetchRepoContents, fetchFileContent } from '../utils/githubService';
import { analyzeCodebase } from '../utils/aiReviewService';
import { createReview, createReviewDetails } from '../utils/reviewDataService';
import LoadingMascot from '../components/common/LoadingMascot';
import CodeInput from '../components/modules/code-review/CodeInput';
import CodeViewer from '../components/modules/code-review/CodeViewer';
import ReviewResults from '../components/modules/code-review/ReviewResults';
import ReviewHeader from '../components/modules/code-review/ReviewHeader';

const CodeReviewPage = () => {
    const [step, setStep] = useState('input'); // input, loading, results
    const [loadingMessage, setLoadingMessage] = useState('Initializing AI Code Engine...');
    const [error, setError] = useState(null);
    const [reviewData, setReviewData] = useState(null);
    const [files, setFiles] = useState([]);
    
    // GitHub Input State
    const [githubUrl, setGithubUrl] = useState('');
    const [manualCode, setManualCode] = useState('');

    const handleGithubReview = async (url) => {
        setStep('loading');
        setError(null);
        setLoadingMessage('Fetching repository contents from GitHub...');
        
        try {
            const parsed = parseGitHubUrl(url);
            if (!parsed) throw new Error('Invalid GitHub URL format.');

            const repoFiles = await fetchRepoContents(parsed.owner, parsed.repo);
            if (repoFiles.length === 0) throw new Error('No supported code files found in this repository.');

            setLoadingMessage(`Fetching content for ${Math.min(repoFiles.length, 15)} files...`);
            
            // Fetch content for the first 15 files
            const filesWithContent = await Promise.all(
                repoFiles.slice(0, 15).map(async (file) => {
                    const content = await fetchFileContent(file.download_url);
                    return { ...file, content };
                })
            );

            setFiles(filesWithContent);
            await runAnalysis(filesWithContent, url, parsed.repo);
        } catch (err) {
            console.error('GitHub Review Error:', err);
            setError(err.message || 'Failed to fetch repository. Ensure it is public.');
            setStep('input');
        }
    };

    const handleManualReview = async (code, language = 'javascript') => {
        setStep('loading');
        setError(null);
        setLoadingMessage('Preparing manual code for analysis...');
        
        try {
            const manualFiles = [{
                name: `snippet.${language}`,
                path: `snippet.${language}`,
                content: code,
                language: language
            }];
            setFiles(manualFiles);
            await runAnalysis(manualFiles, 'Manual Input', 'Code Snippet');
        } catch (err) {
            setError(err.message);
            setStep('input');
        }
    };

    const runAnalysis = async (filesToAnalyze, url, name) => {
        setLoadingMessage('AI is performing deep cognitive analysis on your code...');
        try {
            const results = await analyzeCodebase(filesToAnalyze);
            
            // Save to database
            setLoadingMessage('Finalizing review and saving results...');
            const reviewId = await createReview({
                repo_name: name,
                repo_url: url,
                score: results.score,
                summary: results.summary,
                language: results.language
            });

            if (results.findings && results.findings.length > 0) {
                await createReviewDetails(reviewId, results.findings);
            }

            setReviewData({ ...results, id: reviewId });
            setStep('results');
        } catch (err) {
            setError(err.message);
            setStep('input');
        }
    };

    const resetReview = () => {
        setStep('input');
        setReviewData(null);
        setFiles([]);
        setError(null);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>
                    <Terminal size={16} /> Advanced AI Code Auditor
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Takshila <span className="gradient-text">Code Reviewer</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Automatic bug detection, performance optimization suggestions, and deep architectural insights.
                </p>
            </header>

            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <CodeInput 
                            onGithubSubmit={handleGithubReview} 
                            onManualSubmit={handleManualReview}
                            error={error}
                        />
                    </motion.div>
                )}

                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card"
                        style={{ padding: '80px', background: 'white', border: 'none' }}
                    >
                        <LoadingMascot message={loadingMessage} />
                    </motion.div>
                )}

                {step === 'results' && reviewData && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="animate-fade-in"
                        style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                    >
                        <ReviewHeader data={reviewData} onBack={resetReview} />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px', alignItems: 'start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <CodeViewer files={files} findings={reviewData.findings} />
                                <ReviewResults data={reviewData} />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {/* Sidebar Info */}
                                <div className="glass-card" style={{ padding: '24px', background: 'white', border: 'none' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Info size={18} color="var(--primary)" /> Review Summary
                                    </h3>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {reviewData.summary}
                                    </p>
                                </div>

                                <div className="glass-card" style={{ padding: '24px', background: 'var(--primary)', color: 'white', border: 'none' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', color: 'white' }}>Quick Stats</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Critical Bugs</span>
                                            <span style={{ fontWeight: 800 }}>{reviewData.findings.filter(f => f.severity === 'high' && f.category === 'bug').length}</span>
                                        </div>
                                        <hr style={{ opacity: 0.2 }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Improvements</span>
                                            <span style={{ fontWeight: 800 }}>{reviewData.findings.filter(f => f.category === 'improvement').length}</span>
                                        </div>
                                        <hr style={{ opacity: 0.2 }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Primary Lang</span>
                                            <span style={{ fontWeight: 800 }}>{reviewData.language || 'Detected'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeReviewPage;
