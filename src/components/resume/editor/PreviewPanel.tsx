import React, { useState } from 'react';
import { useResumeStore } from '../../../store/useResumeStore';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, Download } from 'lucide-react';
import ModernSidebarTemplate from '../templates/ModernSidebarTemplate';
import MinimalistStackTemplate from '../templates/MinimalistStackTemplate';
import ExecutiveProTemplate from '../templates/ExecutiveProTemplate';

const PreviewPanel = () => {
    const { resumeData } = useResumeStore();
    const [zoom, setZoom] = useState(0.8);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Template mapping
    const renderTemplate = () => {
        switch (resumeData.settings.template) {
            case 'modern-sidebar':
                return <ModernSidebarTemplate resumeData={resumeData} />;
            case 'minimalist-stack':
                return <MinimalistStackTemplate resumeData={resumeData} />;
            case 'executive-pro':
                return <ExecutiveProTemplate resumeData={resumeData} />;
            default:
                return <ModernSidebarTemplate resumeData={resumeData} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/50 relative overflow-hidden">
            {/* Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <button 
                    onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ZoomOut size={18} />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <span className="text-[10px] font-black text-white w-12 text-center uppercase tracking-widest">
                    {Math.round(zoom * 100)}%
                </span>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button 
                    onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ZoomIn size={18} />
                </button>
                <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className={`ml-2 p-2 rounded-xl transition-all ${isFullscreen ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    <Maximize2 size={18} />
                </button>
            </div>

            {/* AI Floating Button */}
            <button className="absolute bottom-8 right-8 z-20 group flex items-center gap-3 pl-4 pr-6 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-white/20">
                    <Sparkles size={16} className="text-primary group-hover:text-white" />
                </div>
                Enhance with Takshila AI
            </button>

            {/* Resume Container */}
            <div 
                className={`flex-1 overflow-auto custom-scrollbar p-12 pb-32 flex justify-center transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm' : ''}`}
            >
                <div 
                    className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.3)] origin-top transition-transform duration-300"
                    style={{ 
                        width: '210mm',
                        minHeight: '297mm',
                        transform: `scale(${zoom})`,
                        marginBottom: `calc(-297mm * ${1 - zoom})`
                    }}
                >
                    {renderTemplate()}
                </div>

                {isFullscreen && (
                    <button 
                        onClick={() => setIsFullscreen(false)}
                        className="fixed top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl border border-white/10 transition-all"
                    >
                        <Maximize2 size={24} className="rotate-45" />
                    </button>
                )}
            </div>

            {/* Footer Status */}
            {!isFullscreen && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/30 backdrop-blur-sm border-t border-white/5 flex items-center justify-between px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                             Live Editing
                        </span>
                        <span>|</span>
                        <span>{resumeData.settings.fontSize} text</span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                            <Download size={12} /> Auto-saving draft...
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        Takshila AI Premium
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewPanel;
