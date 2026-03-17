import React from 'react';
import { useResumeStore } from '../../../../store/useResumeStore';
import { Plus, Trash2, Calendar, MapPin, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceForm = () => {
    const { resumeData, addItem, updateItem, removeItem, reorderItems } = useResumeStore();
    const experiences = resumeData.experience;

    const handleAdd = () => {
        addItem('experience', {
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        });
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300";
    const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
                {experiences.map((exp, index) => (
                    <div key={exp.id} className="p-6 bg-slate-50/50 rounded-22xl border border-slate-100 relative group/item">
                        <button 
                            onClick={() => removeItem('experience', exp.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={labelClasses}>Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        value={exp.company}
                                        onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
                                        placeholder="Google"
                                        className={`${inputClasses} pl-11`}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className={labelClasses}>Position</label>
                                <input 
                                    value={exp.position}
                                    onChange={(e) => updateItem('experience', exp.id, { position: e.target.value })}
                                    placeholder="Senior Software Engineer"
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => updateItem('experience', exp.id, { startDate: e.target.value })}
                                        className={`${inputClasses} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        type="month"
                                        value={exp.endDate}
                                        disabled={exp.current}
                                        onChange={(e) => updateItem('experience', exp.id, { endDate: e.target.value })}
                                        className={`${inputClasses} pl-11 ${exp.current ? 'opacity-50' : ''}`}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 flex items-center gap-2 mb-2">
                                <input 
                                    type="checkbox"
                                    id={`current-${exp.id}`}
                                    checked={exp.current}
                                    onChange={(e) => updateItem('experience', exp.id, { current: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={`current-${exp.id}`} className="text-xs font-bold text-slate-500 cursor-pointer">I am currently working here</label>
                            </div>
                            <div className="col-span-2">
                                <label className={labelClasses}>Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        value={exp.location}
                                        onChange={(e) => updateItem('experience', exp.id, { location: e.target.value })}
                                        placeholder="Mountain View, CA"
                                        className={`${inputClasses} pl-11`}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className={labelClasses}>Description</label>
                                <textarea 
                                    value={exp.description}
                                    onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                                    placeholder="Describe your role and key achievements..."
                                    className={`${inputClasses} min-h-[120px] resize-none leading-relaxed py-4`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleAdd}
                className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-primary/20 hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Add Experience
            </button>
        </div>
    );
};

export default ExperienceForm;
