import React from 'react';
import { TemplateProps } from './types';

const ModernSidebarTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, experience, education, skills, projects, settings } = resumeData;
    const themeColor = settings.themeColor;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div 
            className="w-full h-full bg-white flex"
            style={{ fontFamily: settings.fontFamily }}
        >
            {/* Sidebar */}
            <div className="w-[280px] bg-slate-50 h-full p-10 flex flex-col shrink-0 border-r border-slate-100">
                {/* Contact Section */}
                <section className="mb-12">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Contact</h3>
                    <div className="space-y-4 text-[11px] font-bold leading-relaxed">
                        <div>
                            <p className="text-slate-300 uppercase tracking-widest text-[9px] mb-1">Email</p>
                            <p className="text-slate-700 break-all">{personalInfo.email || 'hello@example.com'}</p>
                        </div>
                        <div>
                            <p className="text-slate-300 uppercase tracking-widest text-[9px] mb-1">Phone</p>
                            <p className="text-slate-700">{personalInfo.phone || '+1 234 567 890'}</p>
                        </div>
                        <div>
                            <p className="text-slate-300 uppercase tracking-widest text-[9px] mb-1">Location</p>
                            <p className="text-slate-700">{personalInfo.location || 'San Francisco, CA'}</p>
                        </div>
                        {personalInfo.linkedin && (
                            <div>
                                <p className="text-slate-300 uppercase tracking-widest text-[9px] mb-1">LinkedIn</p>
                                <p className="text-slate-700">{personalInfo.linkedin}</p>
                            </div>
                        )}
                        {personalInfo.website && (
                             <div>
                                <p className="text-slate-300 uppercase tracking-widest text-[9px] mb-1">Website</p>
                                <p className="text-slate-700">{personalInfo.website}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Skills Section */}
                <section className="mb-12">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Expertise</h3>
                    <div className="space-y-3">
                        {skills.map((skill) => (
                            <div key={skill.id}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] font-bold text-slate-700">{skill.name}</span>
                                </div>
                                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full transition-all duration-1000"
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

                {/* Languages */}
                {resumeData.languages.length > 0 && (
                    <section>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Languages</h3>
                         <div className="space-y-3">
                            {resumeData.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-slate-700">{lang.name}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{lang.level}</span>
                                </div>
                            ))}
                         </div>
                    </section>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-12">
                {/* Header */}
                <header className="mb-12 border-b-4 pb-8" style={{ borderColor: themeColor }}>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 text-slate-900 leading-none">
                        {personalInfo.firstName || 'YOUR'} <span style={{ color: themeColor }}>{personalInfo.lastName || 'NAME'}</span>
                    </h1>
                    <p className="text-xl font-bold uppercase tracking-[0.3em] text-slate-400">
                        {personalInfo.jobTitle || 'PROFESSIONAL TITLE'}
                    </p>
                </header>

                <div className="space-y-12">
                    {/* Summary */}
                    <section>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6" style={{ color: themeColor }}>Profile</h3>
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                            {summary || 'Highly motivated professional with a strong background in...'}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-slate-50 pb-4" style={{ color: themeColor }}>Experience</h3>
                        <div className="space-y-10">
                            {experience.map((exp) => (
                                <div key={exp.id} className="group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-[15px] font-black text-slate-900 group-hover:text-primary transition-colors">{exp.position}</h4>
                                            <p className="text-[13px] font-bold text-slate-400">{exp.company} | {exp.location}</p>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-mono">
                                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                         <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-slate-50 pb-4" style={{ color: themeColor }}>Education</h3>
                         <div className="grid grid-cols-1 gap-8">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-[14px] font-black text-slate-900">{edu.degree} in {edu.field}</h4>
                                        <p className="text-[12px] font-bold text-slate-400">{edu.school} | {edu.location}</p>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                        {formatDate(edu.startDate)} — {formatDate(edu.endDate) || 'Present'}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </section>

                    {/* Projects */}
                    {projects.length > 0 && (
                        <section>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b-2 border-slate-50 pb-4" style={{ color: themeColor }}>Projects</h3>
                            <div className="grid grid-cols-1 gap-8">
                                {projects.map((proj) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-[14px] font-black text-slate-900">{proj.name}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{proj.date}</span>
                                        </div>
                                        <p className="text-[12px] text-slate-600 leading-relaxed mb-2 font-medium">{proj.description}</p>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest hover:underline" style={{ color: themeColor }}>
                                                Project Link ↗
                                            </a>
                                        )}
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

export default ModernSidebarTemplate;
