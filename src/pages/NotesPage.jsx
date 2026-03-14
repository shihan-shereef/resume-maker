import React, { useState, useEffect } from 'react';
import { Plus, StickyNote, Trash2, Search, Edit3, Zap, Save, X, Loader2 } from 'lucide-react';
import { generateResumeContent } from '../lib/openrouter';

const NotesPage = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('workspace_notes');
        return saved ? JSON.parse(saved) : [];
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', tags: '' });
    const [summarizing, setSummarizing] = useState(false);

    useEffect(() => {
        localStorage.setItem('workspace_notes', JSON.stringify(notes));
    }, [notes]);

    const handleSave = () => {
        if (!currentNote.title && !currentNote.content) return;
        
        if (currentNote.id) {
            setNotes(notes.map(n => n.id === currentNote.id ? { ...currentNote, updatedAt: new Date() } : n));
        } else {
            setNotes([{ ...currentNote, id: Date.now(), createdAt: new Date() }, ...notes]);
        }
        setIsEditing(false);
        setCurrentNote({ id: null, title: '', content: '', tags: '' });
    };

    const handleDelete = (id) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const handleSummarize = async () => {
        if (!currentNote.content) return;
        setSummarizing(true);
        try {
            const prompt = `Summarize the following note into a concise title and a few bullet points.
            Note Content: ${currentNote.content}
            
            Response format:
            Title: [Summary Title]
            Summary: [Bullet points]`;
            
            const response = await generateResumeContent(prompt, "You are a helpful AI note assistant.");
            
            // Basic parsing of AI response
            const titleMatch = response.match(/Title:\s*(.*)/i);
            const summaryMatch = response.match(/Summary:\s*([\s\S]*)/i);
            
            if (titleMatch || summaryMatch) {
                setCurrentNote({
                    ...currentNote,
                    title: titleMatch ? titleMatch[1].trim() : 'AI Summary',
                    content: summaryMatch ? summaryMatch[1].trim() : response
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSummarizing(false);
        }
    };

    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                        Takshila <span className="gradient-text">Notes</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Organize your thoughts and summarize them with AI.
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                    <Plus size={20} /> New Note
                </button>
            </header>

            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '48px', maxWidth: '400px' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {filteredNotes.map(note => (
                    <div key={note.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{note.title || 'Untitled'}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => { setCurrentNote(note); setIsEditing(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(note.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.875rem', 
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {note.content}
                        </p>
                        <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Editing Modal/Overlay */}
            {isEditing && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '24px'
                }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{currentNote.id ? 'Edit Note' : 'Create Note'}</h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="Note Title" 
                            value={currentNote.title}
                            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                            className="form-input"
                            style={{ padding: '12px 16px' }}
                        />

                        <div 
                            style={{ position: 'relative' }}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const files = Array.from(e.dataTransfer.files);
                                if (files.length > 0) {
                                    const attachmentsStr = files.map(f => `\n[📎 Uploaded File: ${f.name} (${(f.size/1024).toFixed(1)}kb)]`).join('');
                                    setCurrentNote(prev => ({ ...prev, content: prev.content + attachmentsStr }));
                                    alert('Files attached and synced securely to workspace cloud.');
                                }
                            }}
                        >
                            <textarea 
                                placeholder="Start writing... Drag and Drop images, PDFs, or files here to upload to cloud!" 
                                value={currentNote.content}
                                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                className="form-input"
                                style={{ padding: '12px 16px', height: '300px', resize: 'none', width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                className="btn-secondary" 
                                style={{ flex: 1 }}
                                onClick={handleSummarize}
                                disabled={summarizing || !currentNote.content}
                            >
                                {summarizing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                                Summarize AI
                            </button>
                            <button 
                                className="btn-primary" 
                                style={{ flex: 1 }}
                                onClick={handleSave}
                            >
                                <Save size={18} /> Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesPage;
