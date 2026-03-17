import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Wand2, Loader2, Check, RefreshCw } from 'lucide-react';
import { aiService } from '../../../lib/ai/resumeEnhancer';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialText: string;
    context: string;
    onApply: (enhancedText: string) => void;
}

const AiModal = ({ isOpen, onClose, initialText, context, onApply }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [enhancedText, setEnhancedText] = useState('');

    const handleEnhance = async () => {
        setIsLoading(true);
        const result = await aiService.enhanceText(initialText, context);
        setEnhancedText(result);
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 bg-slate-900 text-white relative flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Sparkles className="text-primary w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic">Takshila AI Assistant</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Enhancing {context}</p>
                            </div>
                            <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Original Text</label>
                                    <div className="p-6 bg-slate-50 rounded-2xl text-xs font-medium text-slate-500 min-h-[200px] border border-slate-100">
                                        {initialText || 'No background text provided...'}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-widest block ml-1">AI Enhanced</label>
                                    <div className="p-6 bg-primary/5 rounded-2xl text-xs font-bold text-slate-800 min-h-[200px] border border-primary/10 relative overflow-hidden group">
                                        {isLoading && (
                                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Generating brilliance...</span>
                                            </div>
                                        )}
                                        {enhancedText || (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 text-center px-4">
                                                <Wand2 size={32} strokeWidth={1} />
                                                <p>Click enhance to transform your content into professional-grade writing.</p>
                                            </div>
                                        )}
                                        {enhancedText && (
                                            <textarea 
                                                value={enhancedText}
                                                onChange={(e) => setEnhancedText(e.target.value)}
                                                className="w-full h-full bg-transparent border-none outline-none resize-none leading-relaxed"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={handleEnhance}
                                    disabled={isLoading}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {enhancedText ? <RefreshCw size={16} /> : <Wand2 size={16} />}
                                    {enhancedText ? 'Regenerate' : 'Enhance with AI'}
                                </button>
                                {enhancedText && (
                                    <button 
                                        onClick={() => onApply(enhancedText)}
                                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} /> Apply Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AiModal;
