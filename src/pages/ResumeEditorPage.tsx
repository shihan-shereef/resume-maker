import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Download, 
  Settings as SettingsIcon, 
  Eye, 
  Type, 
  Palette, 
  Maximize, 
  Save,
  Rocket,
  Share2
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import Logo from '../components/common/Logo';

import FormPanel from '../components/resume/editor/FormPanel';
import PreviewPanel from '../components/resume/editor/PreviewPanel';
import DesignPanel from '../components/resume/editor/DesignPanel';
import PdfExporter from '../components/resume/PdfExporter';

const ResumeEditorPage = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const { resumeData, updateSettings } = useResumeStore();

    React.useEffect(() => {
        if (templateId && resumeData.settings.template !== templateId) {
            updateSettings({ template: templateId });
        }
    }, [templateId, updateSettings, resumeData.settings.template]);
    const [activeTab, setActiveTab] = useState<'content' | 'design' | 'preview'>('content');
    const [zoom, setZoom] = useState(0.8);

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-[#0f172a]">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 z-50 shrink-0">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                        title="Back to Dashboard"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    </button>
                    <div className="h-8 w-px bg-slate-200" />
                    <Logo size="1.2rem" />
                    <div className="ml-4 flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Editing Resume</span>
                        <h1 className="text-sm font-extrabold truncate max-w-[200px] leading-none">{resumeData.title || 'Untitled Resume'}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex bg-slate-50 p-1 rounded-xl mr-4 border border-slate-100">
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Content
                        </button>
                        <button 
                            onClick={() => setActiveTab('design')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'design' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Design
                        </button>
                    </div>

                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all border border-slate-200">
                        <Save className="w-4 h-4" /> Save Draft
                    </button>

                    <div className="flex items-center gap-4">
                        <PdfExporter data={resumeData} />
                        <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 overflow-hidden relative">
                {/* Left Panel: Form / Design */}
                <div className="w-full md:w-[450px] lg:w-[500px] border-r border-[#e2e8f0] bg-white flex flex-col shrink-0 z-30 shadow-2xl shadow-slate-200/50">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {activeTab === 'content' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <h2 className="text-xl font-black mb-1">Resume Content</h2>
                                <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-wider">Define your professional journey</p>
                                
                                <FormPanel />
                            </div>
                        )}

                        {activeTab === 'design' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <h2 className="text-xl font-black mb-1">Design Settings</h2>
                                <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-wider">Style your presentation</p>
                                
                                <DesignPanel />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 bg-slate-100/50 relative overflow-hidden flex flex-col items-center">
                    {/* Zoom & View Controls */}
                    <div className="absolute top-6 right-6 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white p-1.5 rounded-2xl shadow-xl shadow-slate-200/50">
                        <button 
                            onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 font-bold"
                        >-</button>
                        <span className="text-[10px] font-black w-10 text-center text-slate-400">{Math.round(zoom * 100)}%</span>
                        <button 
                            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 font-bold"
                        >+</button>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
                            <Maximize className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Resume Canvas Container */}
                    <div className="flex-1 w-full overflow-auto flex justify-center p-12 custom-scrollbar">
                        <div 
                            style={{ 
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top center',
                                minWidth: '794px', // A4 Width at 96 DPI
                                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            className="bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] min-h-[1123px] relative mb-24" // A4 Height
                        >
                            <PreviewPanel />
                        </div>
                    </div>

                    {/* Bottom AI Quick Actions (Floater) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
                        <button className="flex items-center gap-3 px-6 py-4 bg-[#0f172a] text-white rounded-full shadow-2xl shadow-slate-900/40 hover:scale-105 active:scale-95 transition-all text-sm font-bold border border-white/10 group">
                            <div className="w-6 h-6 bg-gradient-to-tr from-primary to-orange-400 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <Rocket className="w-4 h-4 text-white" />
                            </div>
                            Enhance with Takshila AI
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResumeEditorPage;
