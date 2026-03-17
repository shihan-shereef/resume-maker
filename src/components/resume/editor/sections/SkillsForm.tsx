import React, { useState } from 'react';
import { useResumeStore } from '../../../../store/useResumeStore';
import { Plus, X, Award, Search } from 'lucide-react';

const SkillsForm = () => {
    const { resumeData, addItem, removeItem, updateItem } = useResumeStore();
    const [inputValue, setInputValue] = useState('');
    const skills = resumeData.skills;

    const handleAddSkill = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (inputValue.trim()) {
            addItem('skills', { name: inputValue.trim(), level: 'Intermediate' });
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddSkill();
        }
    };

    const levels = ['Beginner', 'Intermediate', 'Expert', 'Master'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Add New Skill</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                        <input 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. React.js, Python, Project Management..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300 pl-11"
                        />
                    </div>
                    <button 
                        onClick={() => handleAddSkill()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <div 
                        key={skill.id}
                        className="group flex items-center gap-3 pl-4 pr-2 py-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all"
                    >
                        <span className="text-sm font-bold text-slate-700">{skill.name}</span>
                        <select 
                            value={skill.level}
                            onChange={(e) => updateItem('skills', skill.id, { level: e.target.value })}
                            className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-lg border-none outline-none appearance-none cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                            {levels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <button 
                            onClick={() => removeItem('skills', skill.id)}
                            className="p-1 text-slate-300 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-50 rounded-2xl">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">No skills added yet</p>
                </div>
            )}
        </div>
    );
};

export default SkillsForm;
