import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { templates, TemplateMeta } from './templates';
import { Search, Filter, ArrowRight, Sparkles } from 'lucide-react';

const TemplateGallery = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<TemplateMeta['category'] | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories: ('All' | TemplateMeta['category'])[] = [
        'All', 'Sidebar', 'Two-Column', 'Minimal', 'Infographic', 'Executive', 'Tech'
    ];

    const filteredTemplates = templates.filter(t => 
        (filter === 'All' || t.category === filter) &&
        (t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSelect = (templateId: string) => {
        navigate(`/editor/${templateId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                <div>
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Choose Your <span className="text-primary italic">Perfect</span> Template</h1>
                    <p className="text-slate-500 font-bold text-lg">30+ Professionally designed layouts optimized for ATS</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search templates..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white shadow-lg shadow-orange-500/20' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/20 hover:text-primary'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500"
                    >
                        {/* Thumbnail Placeholder */}
                        <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                            <div className="text-center p-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">{template.category}</span>
                                <h3 className="text-xl font-black mb-4">{template.name}</h3>
                                <div className="w-16 h-1 w-full bg-slate-100 mx-auto rounded-full mb-2" />
                                <div className="w-12 h-1 w-full bg-slate-100 mx-auto rounded-full mb-2" />
                                <div className="w-20 h-1 w-full bg-slate-100 mx-auto rounded-full" />
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 text-center text-white">
                                <p className="font-bold text-sm mb-8 leading-relaxed">{template.description}</p>
                                <button 
                                    onClick={() => handleSelect(template.id)}
                                    className="px-8 py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Use This Template <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Info Bar */}
                        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                            <div>
                                <h4 className="font-extrabold text-[#0f172a] group-hover:text-primary transition-colors">{template.name}</h4>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{template.category}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                <Sparkles size={18} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 border-dashed">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No templates found matching your search</p>
                </div>
            )}
        </div>
    );
};

export default TemplateGallery;
