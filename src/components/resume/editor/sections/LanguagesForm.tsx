import React from 'react';
import { useResumeStore } from '../../../../store/useResumeStore';
import { Plus, Trash2, Globe } from 'lucide-react';

const LanguagesForm = () => {
    const { resumeData, addItem, updateItem, removeItem } = useResumeStore();
    const languages = resumeData.languages;

    const handleAdd = () => {
        addItem('languages', {
            name: '',
            level: 'Native'
        });
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300";
    const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

    const proficiencyLevels = ['Native', 'Fluent', 'Intermediate', 'Beginner'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
                {languages.map((lang) => (
                    <div key={lang.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group/item">
                        <button 
                            onClick={() => removeItem('languages', lang.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        value={lang.name}
                                        onChange={(e) => updateItem('languages', lang.id, { name: e.target.value })}
                                        placeholder="English"
                                        className={`${inputClasses} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Proficiency</label>
                                <select 
                                    value={lang.level}
                                    onChange={(e) => updateItem('languages', lang.id, { level: e.target.value })}
                                    className={inputClasses}
                                >
                                    {proficiencyLevels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleAdd}
                className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-primary/20 hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Add Language
            </button>
        </div>
    );
};

export default LanguagesForm;
