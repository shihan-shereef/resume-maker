import React, { useRef, useEffect } from 'react';
import { 
    Bold, Italic, Underline, List, ListOrdered, 
    Type, Palette, Heading1, Heading2, Quote, 
    Link as LinkIcon, Image as ImageIcon, Code, 
    ChevronDown, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command, val = null) => {
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = (e) => {
        onChange(e.target.innerHTML);
    };

    const ToolbarButton = ({ icon: Icon, onClick, title, active }) => (
        <button
            onClick={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className="toolbar-btn"
            style={{
                background: active ? '#f1f5f9' : 'transparent',
                border: 'none',
                padding: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s'
            }}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            overflow: 'hidden',
            background: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Toolbar */}
            <div style={{ 
                padding: '8px', 
                background: '#f8fafc', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px'
            }}>
                <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="Bold" />
                <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="Italic" />
                <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} title="Underline" />
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />
                
                <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', 'H1')} title="H1" />
                <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', 'H2')} title="H2" />
                <ToolbarButton icon={Quote} onClick={() => execCommand('formatBlock', 'blockquote')} title="Quote" />
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />

                <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
                <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />
                <ToolbarButton icon={Code} onClick={() => execCommand('formatBlock', 'pre')} title="Code Block" />
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />

                <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="Align Left" />
                <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="Align Center" />
                <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="Align Right" />
            </div>

            {/* Editor Area */}
            <div 
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                placeholder={placeholder}
                className="pro-editor"
                style={{
                    padding: '20px',
                    minHeight: '300px',
                    outline: 'none',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    overflowY: 'auto'
                }}
            />
            
            <style>{`
                .pro-editor:empty:before {
                    content: attr(placeholder);
                    color: #94a3b8;
                    cursor: text;
                }
                .pro-editor h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
                .pro-editor h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.8rem; }
                .pro-editor blockquote { 
                    border-left: 4px solid var(--primary); 
                    padding-left: 1rem; 
                    margin: 1rem 0; 
                    color: var(--text-secondary);
                    font-style: italic;
                }
                .pro-editor pre {
                    background: #f1f5f9;
                    padding: 1rem;
                    border-radius: 8px;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9rem;
                    margin: 1rem 0;
                    overflow-x: auto;
                }
                .toolbar-btn:hover {
                    background: #f1f5f9 !important;
                    color: var(--primary) !important;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
