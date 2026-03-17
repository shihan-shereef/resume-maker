import React from 'react';
import { TemplateProps } from './types';

const ExecutiveProTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
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
            <header className="border-b-8 mb-12 pb-8 flex justify-between items-end" style={{ borderColor: themeColor }}>
                <div>
                    <h1 className="text-5xl font-black text-slate-900 leading-none mb-4">
                        {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">
                        {personalInfo.jobTitle}
                    </p>
                </div>
                <div className="text-right text-[11px] font-bold text-slate-400 space-y-1">
                    <p>{personalInfo.location}</p>
                    <p>{personalInfo.phone}</p>
                    <p className="text-slate-900 border-b border-slate-100 pb-1">{personalInfo.email}</p>
                    <div className="flex justify-end gap-3 mt-2">
                        {personalInfo.linkedin && <span>LinkedIn</span>}
                        {personalInfo.website && <span>Portfolio</span>}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-12">
                {/* Left Column - Core Info */}
                <div className="col-span-1 space-y-12">
                    {/* Summary */}
                    {summary && (
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900">Executive Profile</h3>
                            <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                {summary}
                            </p>
                        </section>
                    )}

                    {/* Skills */}
                    <section>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-slate-900">Core Competencies</h3>
                        <div className="space-y-3">
                            {skills.map((skill) => (
                                <div key={skill.id} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                                        <span>{skill.name}</span>
                                        <span style={{ color: themeColor }}>{skill.level}</span>
                                    </div>
                                    <div className="h-0.5 bg-slate-100 w-full">
                                        <div 
                                            className="h-full" 
                                            style={{ 
                                                backgroundColor: themeColor,
                                                width: skill.level === 'Master' ? '100%' : skill.level === 'Expert' ? '85%' : skill.level === 'Intermediate' ? '65%' : '40%' 
                                            }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-slate-900">Education</h3>
                        <div className="space-y-6">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <p className="text-[12px] font-black text-slate-800">{edu.degree}</p>
                                    <p className="text-[11px] font-bold text-slate-500">{edu.school}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">{formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Present'}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column - Career History */}
                <div className="col-span-2 space-y-12">
                    <section>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 text-slate-900 border-l-4 pl-4" style={{ borderLeftColor: themeColor }}>Leadership Experience</h3>
                        <div className="space-y-10">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="text-[16px] font-black text-slate-900">{exp.position}</h4>
                                        <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">
                                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-bold mb-4" style={{ color: themeColor }}>{exp.company} | {exp.location}</p>
                                    <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    {projects.length > 0 && (
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 text-slate-900 border-l-4 pl-4" style={{ borderLeftColor: themeColor }}>Key Initiatives</h3>
                            <div className="grid grid-cols-1 gap-8">
                                {projects.map((proj) => (
                                    <div key={proj.id}>
                                        <h4 className="text-[14px] font-black text-slate-800 mb-1">{proj.name}</h4>
                                        <p className="text-[11px] text-slate-500 italic mb-2">{proj.date}</p>
                                        <p className="text-[12px] text-slate-600 leading-relaxed font-medium">{proj.description}</p>
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

export default ExecutiveProTemplate;
