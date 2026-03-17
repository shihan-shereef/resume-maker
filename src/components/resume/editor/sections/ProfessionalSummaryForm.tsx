import React, { useState } from 'react';
import { useResumeStore } from '../../../../store/useResumeStore';
import { Sparkles, Wand2 } from 'lucide-react';
import AiModal from '../AiModal';

const ProfessionalSummaryForm = () => {
    const { resumeData, updateSummary } = useResumeStore();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const handleApplyAi = (text: string) => {
        updateSummary(text);
        setIsAiModalOpen(false);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Summary</label>
                <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                    <Wand2 size={12} /> AI Rewrite
                </button>
            </div>
            
            <textarea 
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Briefly explain your professional background, key achievements, and career goals..."
                className="w-full h-40 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300 resize-none leading-relaxed"
            />

            <AiModal 
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                initialText={resumeData.summary}
                context="Professional Summary"
                onApply={handleApplyAi}
            />
        </div>
    );
};

export default ProfessionalSummaryForm;
