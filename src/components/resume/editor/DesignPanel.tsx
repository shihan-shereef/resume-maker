import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore';
import { Palette, Type, AlignLeft, Layout } from 'lucide-react';

const DesignPanel = () => {
    const { resumeData, updateSettings } = useResumeStore();
    const settings = resumeData.settings;

    const colors = [
        '#2563eb', // Blue
        '#7c3aed', // Violet
        '#db2777', // Pink
        '#dc2626', // Red
        '#ea580c', // Orange
        '#16a34a', // Green
        '#0891b2', // Cyan
        '#0f172a', // Slate
    ];

    const fonts = [
        { name: 'Inter', family: "'Inter', sans-serif" },
        { name: 'Roboto', family: "'Roboto', sans-serif" },
        { name: 'Merriweather', family: "'Merriweather', serif" },
        { name: 'Outfit', family: "'Outfit', sans-serif" },
        { name: 'Playfair Display', family: "'Playfair Display', serif" },
    ];

    const fontSizes = ['small', 'medium', 'large'];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Color Palette */}
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => updateSettings({ themeColor: color })}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${settings.themeColor === color ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center bg-slate-50 relative group cursor-pointer overflow-hidden">
                        <Palette className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <input 
                            type="color" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={settings.themeColor}
                            onChange={(e) => updateSettings({ themeColor: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Typography */}
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Typography</label>
                <div className="space-y-3">
                    {fonts.map((font) => (
                        <button
                            key={font.name}
                            onClick={() => updateSettings({ fontFamily: font.family })}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${settings.fontFamily === font.family ? 'bg-primary/5 border-primary/20 shadow-sm ring-1 ring-primary/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'}`}
                            style={{ fontFamily: font.family }}
                        >
                            <span className="text-sm font-bold text-slate-700">{font.name}</span>
                            {settings.fontFamily === font.family && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout Settings */}
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Font Size</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    {fontSizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => updateSettings({ fontSize: size as any })}
                            className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${settings.fontSize === size ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesignPanel;
