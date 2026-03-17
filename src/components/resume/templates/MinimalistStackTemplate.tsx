import React from 'react';
import { TemplateProps } from './types';

const MinimalistStackTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, experience, education, skills, projects, settings } = resumeData;
    const themeColor = settings.themeColor;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div 
            className="w-full h-full bg-white p-16"
            style={{ fontFamily: settings.fontFamily }}
        >
            {/* Header */}
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-4 text-slate-900">
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <div className="flex justify-center items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{personalInfo.email}</span>
                    <span>•</span>
                    <span>{personalInfo.phone}</span>
                    <span>•</span>
                    <span>{personalInfo.location}</span>
                </div>
                {personalInfo.jobTitle && (
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.3em]" style={{ color: themeColor }}>
                        {personalInfo.jobTitle}
                    </p>
                )}
            </header>

            <div className="space-y-12 max-w-3xl mx-auto">
                {/* Summary */}
                {summary && (
                    <section>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6 text-slate-300">Profile</h3>
                         <p className="text-[13px] text-slate-600 leading-relaxed text-center font-medium italic">
                            "{summary}"
                         </p>
                    </section>
                )}

                {/* Experience */}
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4" style={{ color: themeColor }}>Professional Experience</h3>
                    <div className="space-y-10">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{exp.position}</h4>
                                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                                        {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                <p className="text-[12px] font-bold text-slate-500 mb-4">{exp.company} | {exp.location}</p>
                                <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4" style={{ color: themeColor }}>Education</h3>
                    <div className="space-y-6">
                        {education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-baseline">
                                <div>
                                    <h4 className="text-[13px] font-black text-slate-900">{edu.degree}</h4>
                                    <p className="text-[11px] font-bold text-slate-500">{edu.school} • {edu.field}</p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 font-mono">
                                    {formatDate(edu.startDate)} — {formatDate(edu.endDate) || 'Present'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-center text-slate-300">Expertise</h3>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-700">{skill.name}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MinimalistStackTemplate;
