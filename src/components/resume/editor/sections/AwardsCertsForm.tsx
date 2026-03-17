import React from 'react';
import { useResumeStore } from '../../../../store/useResumeStore';
import { Plus, Trash2, Award, Calendar } from 'lucide-react';

interface Props {
    section: 'awards' | 'certifications';
    label: string;
}

const AwardsCertsForm = ({ section, label }: Props) => {
    const { resumeData, addItem, updateItem, removeItem } = useResumeStore();
    const items = resumeData[section] as any[];

    const handleAdd = () => {
        addItem(section, {
            title: '',
            date: '',
            issuer: ''
        });
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300";
    const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group/item">
                        <button 
                            onClick={() => removeItem(section, item.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={labelClasses}>{label} Title</label>
                                <div className="relative">
                                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        value={item.title}
                                        onChange={(e) => updateItem(section, item.id, { title: e.target.value })}
                                        placeholder={`e.g. Employee of the Month`}
                                        className={`${inputClasses} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Issuer</label>
                                <input 
                                    value={item.issuer}
                                    onChange={(e) => updateItem(section, item.id, { issuer: e.target.value })}
                                    placeholder="Google"
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                    <input 
                                        type="month"
                                        value={item.date}
                                        onChange={(e) => updateItem(section, item.id, { date: e.target.value })}
                                        className={`${inputClasses} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleAdd}
                className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-primary/20 hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Add {label}
            </button>
        </div>
    );
};

export default AwardsCertsForm;
