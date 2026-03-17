import React from 'react';
import { TemplateProps } from './types';

const TechInnovatorTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, experience, education, skills, projects, settings } = resumeData;
    const themeColor = settings.themeColor;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div 
            className="w-full h-full bg-slate-50 p-12 overflow-hidden"
            style={{ fontFamily: settings.fontFamily }}
        >
            {/* Header / Banner */}
            <header className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 flex justify-between items-center mb-10">
                <div>
                     <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                        {personalInfo.firstName} <span style={{ color: themeColor }}>{personalInfo.lastName}</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] font-mono">
                        {personalInfo.jobTitle || 'System Architect'}
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-[11px] font-bold text-slate-500">{personalInfo.email}</p>
                    <p className="text-[11px] font-bold text-slate-500">{personalInfo.phone}</p>
                    <p className="text-[11px] font-black uppercase text-primary tracking-widest">{personalInfo.location}</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-10">
                {/* Main Column */}
                <div className="col-span-8 space-y-10">
                    {/* Summary */}
                    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Manifesto</h3>
                         <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                            {summary}
                         </p>
                    </section>

                    {/* Experience */}
                    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Engineering History</h3>
                        <div className="space-y-10">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight">{exp.position}</h4>
                                        <span className="text-[10px] font-bold text-slate-400 font-mono italic">
                                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: themeColor }}>{exp.company}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="col-span-4 space-y-10">
                    {/* Skills Grid */}
                    <section className="bg-slate-900 rounded-[2rem] p-8 text-white">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 text-center">Stack Overflow</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <div key={skill.id} className="group relative">
                                    <span className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 block group-hover:bg-primary group-hover:border-primary transition-all">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Credentials</h3>
                        <div className="space-y-6">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <p className="text-xs font-black text-slate-900 mb-1">{edu.degree}</p>
                                    <p className="text-[10px] font-bold text-slate-400">{edu.school}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    {projects.length > 0 && (
                        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Deployments</h3>
                            <div className="space-y-6">
                                {projects.map((proj) => (
                                    <div key={proj.id}>
                                        <h4 className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{proj.name}</h4>
                                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechInnovatorTemplate;
