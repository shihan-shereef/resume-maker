import React, { useState, useEffect, useRef } from 'react';
import { 
    Plus, StickyNote, Trash2, Search, Edit3, Zap, Save, X, Loader2, 
    Folder, Tag, Pin, Star, MoreVertical, Layout, History, 
    Download, Maximize2, Minimize2, Eye, Languages, Sparkles,
    BrainCircuit, BookOpen, Quote, HelpCircle, FileText, ChevronRight, Printer, ChevronDown, BookOpenCheck, Settings
} from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';
import { useReactToPrint } from 'react-to-print';
import RichTextEditor from '../components/notes/RichTextEditor';

const NotesPage = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('workspace_notes');
        return saved ? JSON.parse(saved) : [];
    });

    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem('workspace_folders');
        return saved ? JSON.parse(saved) : ['General', 'Work', 'Study', 'Personal'];
    });
    const [activeFolder, setActiveFolder] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentNote, setCurrentNote] = useState({ 
        id: null, 
        title: '', 
        content: '', 
        tags: [], 
        folder: 'General',
        isPinned: false,
        isFavorite: false,
        versionHistory: [] 
    });
    const [summarizing, setSummarizing] = useState(false);
    const [aiActionLoading, setAiActionLoading] = useState(null);

    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: currentNote.title || 'Takshila-AI-Note'
    });

    useEffect(() => {
        localStorage.setItem('workspace_notes', JSON.stringify(notes));
    }, [notes]);

    const handleSave = () => {
        if (!currentNote.title && !currentNote.content) return;
        
        const now = new Date();
        if (currentNote.id) {
            const oldNote = notes.find(n => n.id === currentNote.id);
            const history = oldNote?.versionHistory || [];
            // Only add to history if content changed
            if (oldNote && oldNote.content !== currentNote.content) {
                history.unshift({ timestamp: oldNote.updatedAt || oldNote.createdAt, content: oldNote.content });
            }

            setNotes(notes.map(n => n.id === currentNote.id ? { 
                ...currentNote, 
                updatedAt: now,
                versionHistory: history.slice(0, 5) // Keep last 5 versions
            } : n));
        } else {
            setNotes([{ ...currentNote, id: Date.now(), createdAt: now, updatedAt: now }, ...notes]);
        }
        setIsEditing(false);
        setIsFullscreen(false);
        setCurrentNote({ 
            id: null, title: '', content: '', tags: [], folder: 'General', 
            isPinned: false, isFavorite: false, versionHistory: [] 
        });
    };

    const handleDelete = (id) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const handleAiAction = async (action, instruction) => {
        if (!currentNote.content) return;
        setAiActionLoading(action);
        try {
            const prompt = `Action: ${instruction}
            Current Note Content: ${currentNote.content}
            
            Return ONLY the processed text with professional formatting if needed. Do not include conversation.`;
            
            const response = await generateResumeContent(prompt, "You are a professional AI editor for Takshila AI Notes.");
            
            if (action === 'summary') {
                setCurrentNote(prev => ({ ...prev, content: `<h2>AI Summary</h2>\n${response}\n\n<hr/>\n${prev.content}` }));
            } else if (action === 'rewrite') {
                setCurrentNote(prev => ({ ...prev, content: response }));
            } else if (action === 'title') {
                setCurrentNote(prev => ({ ...prev, title: response.replace(/["']/g, '') }));
            } else {
                // For flashcards, quizzes, etc. just append them
                setCurrentNote(prev => ({ ...prev, content: `${prev.content}\n\n<hr/>\n<h2>AI Generated ${action}</h2>\n${response}` }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAiActionLoading(null);
        }
    };

    const togglePin = (e, id) => {
        e.stopPropagation();
        setNotes(notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    };

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        setNotes(notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
    };

    const exportNote = (format) => {
        let content = '';
        let extension = 'txt';
        
        if (format === 'MD') {
            content = `# ${currentNote.title}\n\n${currentNote.content.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1').replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1').replace(/<[^>]*>/g, '')}`;
            extension = 'md';
        } else {
            content = `Title: ${currentNote.title}\n\n${currentNote.content.replace(/<[^>]*>/g, '')}`;
            extension = 'txt';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentNote.title || 'Note'}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredNotes = notes
        .filter(n => (activeFolder === 'All' || n.folder === activeFolder))
        .filter(n => 
            n.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            n.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', minHeight: 'calc(100vh - 100px)' }}>
            {/* Sidebar / Folders */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Folder size={14} /> Notebooks
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button 
                            onClick={() => setActiveFolder('All')}
                            className={`folder-item ${activeFolder === 'All' ? 'active' : ''}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                borderRadius: '8px', border: 'none', background: activeFolder === 'All' ? 'var(--primary)' : 'transparent',
                                color: activeFolder === 'All' ? 'white' : 'var(--text-secondary)', cursor: 'pointer',
                                fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s'
                            }}
                        >
                            <Layout size={18} /> All Notes
                        </button>
                        {folders.map(folder => (
                            <button 
                                key={folder}
                                onClick={() => setActiveFolder(folder)}
                                className={`folder-item ${activeFolder === folder ? 'active' : ''}`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                    borderRadius: '8px', border: 'none', background: activeFolder === folder ? 'var(--primary)' : 'transparent',
                                    color: activeFolder === folder ? 'white' : 'var(--text-secondary)', cursor: 'pointer',
                                    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s'
                                }}
                            >
                                <StickyNote size={18} /> {folder}
                            </button>
                        ))}
                    </div>
                    <button 
                        style={{ marginTop: '16px', width: '100%', background: 'none', border: '1px dashed #cbd5e1', padding: '8px', borderRadius: '8px', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                        onClick={() => {
                            const name = prompt('Folder name?');
                            if (name) setFolders([...folders, name]);
                        }}
                    >
                        <Plus size={14} /> New Notebook
                    </button>
                </div>

                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={14} /> Tags
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Study', 'Design', 'Coding', 'Research'].map(tag => (
                            <span key={tag} style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                            Takshila <span className="gradient-text">AI Notes</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Professional AI-powered notebook for knowledge work.
                        </p>
                    </div>
                    <button className="btn-primary" onClick={() => {
                        setCurrentNote({ id: null, title: '', content: '', tags: [], folder: activeFolder === 'All' ? 'General' : activeFolder, isPinned: false, isFavorite: false, versionHistory: [] });
                        setIsEditing(true);
                    }}>
                        <Plus size={20} /> Create Note
                    </button>
                </header>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input 
                            type="text" 
                            placeholder="AI Semantic Search (e.g. 'find my design strategy notes')..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '48px' }}
                        />
                    </div>
                    <select 
                        className="form-input" 
                        style={{ width: 'auto', padding: '8px 16px' }}
                        onChange={(e) => {
                            // Sort logic would go here
                        }}
                    >
                        <option>Recently Created</option>
                        <option>Recently Edited</option>
                        <option>Title A-Z</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filteredNotes.map(note => (
                        <div key={note.id} className="glass-card hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', border: note.isPinned ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {note.isPinned && <Pin size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />}
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{note.title || 'Untitled Note'}</h3>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{note.folder}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={(e) => toggleFavorite(e, note.id)} style={{ background: 'none', border: 'none', color: note.isFavorite ? '#f59e0b' : 'var(--text-tertiary)', cursor: 'pointer' }}>
                                        <Star size={16} fill={note.isFavorite ? 'currentColor' : 'none'} />
                                    </button>
                                    <button onClick={() => { setCurrentNote(note); setIsEditing(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(note.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div 
                                style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '0.9rem', 
                                    lineHeight: 1.6,
                                    maxHeight: '120px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: 'vertical'
                                }}
                                dangerouslySetInnerHTML={{ __html: note.content || '<i>No content...</i>' }}
                            />
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <span style={{ padding: '2px 8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>AI SYNCED</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editing Modal/Overlay */}
            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, padding: isFullscreen ? '0' : '24px'
                }}>
                    <div className="glass-card animate-scale-in" style={{ 
                        width: '100%', maxWidth: isFullscreen ? '100%' : '1000px', 
                        height: isFullscreen ? '100vh' : '90vh',
                        display: 'grid', gridTemplateRows: 'auto 1fr auto',
                        background: 'white', overflow: 'hidden', borderRadius: isFullscreen ? '0' : '24px'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <BookOpenCheck size={24} style={{ color: 'var(--primary)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Note Title" 
                                    value={currentNote.title}
                                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                    style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button onClick={() => setIsFullscreen(!isFullscreen)} className="toolbar-btn" style={{ padding: '8px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                                <button onClick={() => setIsEditing(false)} style={{ padding: '8px', borderRadius: '8px', background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Editor Main Content Area */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', height: '100%' }}>
                            <div 
                                ref={printRef}
                                style={{ padding: '24px', overflowY: 'auto' }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const files = Array.from(e.dataTransfer.files);
                                    if (files.length > 0) {
                                        files.forEach(file => {
                                            if (file.type.startsWith('image/')) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const imgHtml = `<img src="${event.target.result}" style="max-width: 100%; border-radius: 12px; margin: 12px 0;" />`;
                                                    setCurrentNote(prev => ({ ...prev, content: prev.content + imgHtml }));
                                                };
                                                reader.readAsDataURL(file);
                                            } else {
                                                const fileHtml = `<div style="padding: 12px; background: #f1f5f9; border-radius: 8px; margin: 8px 0; display: flex; alignItems: center; gap: 10px;">📎 <b>${file.name}</b> (${(file.size/1024).toFixed(1)}kb)</div>`;
                                                setCurrentNote(prev => ({ ...prev, content: prev.content + fileHtml }));
                                            }
                                        });
                                    }
                                }}
                            >
                                <RichTextEditor 
                                    value={currentNote.content} 
                                    onChange={(val) => setCurrentNote(prev => ({ ...prev, content: val }))}
                                    placeholder="Start your AI-powered thinking here... Drag & Drop images or PDFs to attach!"
                                />
                            </div>

                            {/* Floating AI Toolbar Sidebar */}
                            <div style={{ background: '#f8fafc', borderLeft: '1px solid #f1f5f9', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sparkles size={14} style={{ color: 'var(--primary)' }} /> AI Intelligence
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                        <button disabled={aiActionLoading === 'summary'} onClick={() => handleAiAction('summary', 'Summarize this note into a clean executive summary with bullet points.')} className="ai-btn">
                                            {aiActionLoading === 'summary' ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />} Summarize Note
                                        </button>
                                        <button disabled={aiActionLoading === 'rewrite'} onClick={() => handleAiAction('rewrite', 'Rewrite this note to be more professional, clear, and concise.')} className="ai-btn">
                                            {aiActionLoading === 'rewrite' ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />} Professional Rewrite
                                        </button>
                                        <button disabled={aiActionLoading === 'quiz'} onClick={() => handleAiAction('quiz', 'Create 5 challenging multiple choice questions based on this note for a study session.')} className="ai-btn">
                                            {aiActionLoading === 'quiz' ? <Loader2 size={16} className="animate-spin" /> : <HelpCircle size={16} />} Generate Study Quiz
                                        </button>
                                        <button disabled={aiActionLoading === 'flashcard'} onClick={() => handleAiAction('flashcard', 'Extract 3 key concepts and create flashcards (Question/Answer format).')} className="ai-btn">
                                            {aiActionLoading === 'flashcard' ? <Loader2 size={16} className="animate-spin" /> : <Layout size={16} />} AI Flashcards
                                        </button>
                                        <button disabled={aiActionLoading === 'mindmap'} onClick={() => handleAiAction('mindmap', 'Create a structured Mind Map in Mermaid.js syntax for this note contents.')} className="ai-btn">
                                            {aiActionLoading === 'mindmap' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generate Mind Map
                                        </button>
                                        <button disabled={aiActionLoading === 'title'} onClick={() => handleAiAction('title', 'Generate a catchy but professional 5-word title for this note.')} className="ai-btn">
                                            {aiActionLoading === 'title' ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />} AI Title Generator
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Settings size={14} /> Organization
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <select 
                                            value={currentNote.folder}
                                            onChange={(e) => setCurrentNote({ ...currentNote, folder: e.target.value })}
                                            className="form-input"
                                            style={{ padding: '8px' }}
                                        >
                                            {folders.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => setCurrentNote({...currentNote, isPinned: !currentNote.isPinned})} style={{ flex: 1, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', background: currentNote.isPinned ? '#eff6ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                <Pin size={16} style={{ color: currentNote.isPinned ? 'var(--primary)' : '#94a3b8' }} /> {currentNote.isPinned ? 'Pinned' : 'Pin'}
                                            </button>
                                            <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
                                                <button className="toolbar-btn" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                    <Download size={16} /> Export <ChevronDown size={12} />
                                                    <select 
                                                        style={{ position: 'absolute', opacity: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'PDF') handlePrint();
                                                            else exportNote(e.target.value);
                                                        }}
                                                    >
                                                        <option value="">Select Format</option>
                                                        <option value="PDF">Professional PDF</option>
                                                        <option value="MD">Markdown (.md)</option>
                                                        <option value="TXT">Plain Text (.txt)</option>
                                                    </select>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <History size={14} /> History (Auto-Saved)
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {currentNote.versionHistory?.length > 0 ? currentNote.versionHistory.map((v, i) => (
                                            <div key={i} style={{ fontSize: '0.7rem', padding: '8px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                                                Last sync: {new Date(v.timestamp).toLocaleTimeString()}
                                            </div>
                                        )) : (
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>No history yet</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '20px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '0.85rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> Tracking changes...</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={14} /> AI Processing Localized</span>
                            </div>
                            <button className="btn-primary" onClick={handleSave} style={{ minWidth: '160px' }}>
                                <Save size={18} /> Sync & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .folder-item.active {
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
                }
                .ai-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: white;
                    color: #475569;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .ai-btn:hover:not(:disabled) {
                    background: #f1f5f9;
                    border-color: var(--primary);
                    color: var(--primary);
                    transform: translateX(4px);
                }
                .ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .hover-lift { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
                .hover-lift:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
            `}</style>
        </div>
    );
};

export default NotesPage;
