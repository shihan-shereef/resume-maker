import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Folder, File, ChevronRight, ChevronDown, Bug, Sparkles, HelpCircle, Terminal } from 'lucide-react';

const CodeViewer = ({ files, findings }) => {
    const [selectedFile, setSelectedFile] = useState(files[0] || null);
    const [expandedFolders, setExpandedFolders] = useState(['root']);

    // Build file tree structure
    const buildTree = (files) => {
        const tree = { name: 'root', type: 'dir', children: {} };
        
        files.forEach(file => {
            const parts = file.path.split('/');
            let current = tree;
            
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current.children[part] = { 
                        name: part, 
                        type: 'file', 
                        file: file,
                        findings: findings.filter(f => f.file_path === file.path)
                    };
                } else {
                    if (!current.children[part]) {
                        current.children[part] = { name: part, type: 'dir', children: {} };
                    }
                    current = current.children[part];
                }
            });
        });
        
        return tree;
    };

    const tree = buildTree(files);

    const toggleFolder = (path) => {
        setExpandedFolders(prev => 
            prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
        );
    };

    const renderTree = (node, path = 'root') => {
        const sortedChildren = Object.values(node.children).sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
        });

        return (
            <div key={path} style={{ marginLeft: path === 'root' ? 0 : '16px' }}>
                {sortedChildren.map(child => {
                    const childPath = `${path}/${child.name}`;
                    const isExpanded = expandedFolders.includes(childPath);
                    const hasFindings = child.findings && child.findings.length > 0;

                    if (child.type === 'dir') {
                        return (
                            <div key={childPath}>
                                <div 
                                    onClick={() => toggleFolder(childPath)}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', 
                                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#475569',
                                        transition: '0.2s', fontWeight: 600
                                    }}
                                    className="tree-item-hover"
                                >
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <Folder size={16} color="#6366f1" fill="#6366f1" />
                                    {child.name}
                                </div>
                                {isExpanded && renderTree(child, childPath)}
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={childPath}
                            onClick={() => setSelectedFile(child.file)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', 
                                borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
                                color: selectedFile?.path === child.file.path ? 'var(--primary)' : '#475569',
                                background: selectedFile?.path === child.file.path ? 'rgba(255, 92, 0, 0.05)' : 'transparent',
                                fontWeight: selectedFile?.path === child.file.path ? 700 : 500,
                                marginBottom: '2px'
                            }}
                            className="tree-item-hover"
                        >
                            <File size={16} color="#94a3b8" />
                            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{child.name}</span>
                            {hasFindings && (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {child.findings.some(f => f.category === 'bug') && <Bug size={12} color="#ef4444" />}
                                    {child.findings.some(f => f.category === 'improvement') && <Sparkles size={12} color="#f59e0b" />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const currentFileFindings = findings.filter(f => f.file_path === selectedFile?.path);

    return (
        <div className="glass-card" style={{ padding: '0', background: 'white', border: 'none', overflow: 'hidden', display: 'flex', height: '600px' }}>
            {/* Sidebar File Tree */}
            <div style={{ width: '260px', borderRight: '1px solid #f1f5f9', background: '#f8fafc', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Project Explorer
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {renderTree(tree)}
                </div>
            </div>

            {/* Code Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
                <div style={{ padding: '12px 24px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <File size={16} color="#94a3b8" />
                    <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 700 }}>{selectedFile?.path || 'No file selected'}</span>
                </div>
                
                <div style={{ flex: 1, overflow: 'auto', position: 'relative' }} className="custom-scrollbar">
                    {selectedFile ? (
                        <SyntaxHighlighter 
                            language={selectedFile.language || selectedFile.name.split('.').pop()}
                            style={atomDark}
                            customStyle={{ margin: 0, padding: '24px', background: 'transparent', fontSize: '0.9rem' }}
                            showLineNumbers={true}
                            wrapLines={true}
                            lineProps={(lineNumber) => {
                                const finding = currentFileFindings.find(f => f.line_number === lineNumber);
                                if (finding) {
                                    return {
                                        style: { 
                                            display: 'block', 
                                            backgroundColor: finding.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                                            margin: '0 -24px',
                                            padding: '0 24px'
                                        }
                                    };
                                }
                                return {};
                            }}
                        >
                            {selectedFile.content}
                        </SyntaxHighlighter>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', gap: '16px' }}>
                            <Terminal size={48} opacity={0.5} />
                            <p>Select a file to view code</p>
                        </div>
                    )}

                    {/* Findings Overlay for currently selected file */}
                    {currentFileFindings.map((finding, idx) => (
                        <div 
                            key={idx}
                            style={{ 
                                position: 'absolute', top: `${(finding.line_number - 1) * 21 + 24}px`, right: '20px',
                                background: finding.severity === 'high' ? '#ef4444' : '#f59e0b',
                                color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                        >
                            {finding.category === 'bug' ? <Bug size={10} /> : <Sparkles size={10} />}
                            Line {finding.line_number}: {finding.description.substring(0, 30)}...
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                .tree-item-hover:hover { background: #f1f5f9; }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default CodeViewer;
