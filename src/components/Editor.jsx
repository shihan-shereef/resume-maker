import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, FileText, Settings, Key, BookOpen, Award, Medal, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import SummaryForm from './SummaryForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import CertificationsForm from './CertificationsForm';
import AchievementsForm from './AchievementsForm';
import AtsChecker from './AtsChecker';
import { useResume } from '../context/ResumeContext';

const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children }) => {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            marginBottom: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: isOpen ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none'
        }}>
            <button
                onClick={onToggle}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: isOpen ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    border: 'none',
                    color: isOpen ? 'var(--primary)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={20} />
                    {title}
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isOpen && (
                <div style={{ padding: '24px 20px', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--glass-border)' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const TemplateSettings = () => {
    const { resumeData, updateSettings } = useResume();
    const templates = ['modern', 'minimal', 'corporate', 'professional', 'creative', 'traditional', 'tech'];
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
    const fonts = ['Outfit', 'Roboto', 'Inter', 'Merriweather', 'Playfair Display'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Template</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {templates.map(t => (
                        <button
                            key={t}
                            className={resumeData.settings.template === t ? "btn-primary" : "btn-secondary"}
                            onClick={() => updateSettings({ template: t })}
                            style={{ textTransform: 'capitalize', flex: '1 0 30%', padding: '8px', fontSize: '0.85rem' }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Theme Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => updateSettings({ themeColor: c })}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: c,
                                border: resumeData.settings.themeColor === c ? '3px solid white' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ))}
                </div>
            </div>

            <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Typography</label>
                <select
                    className="form-input"
                    value={resumeData.settings.font}
                    onChange={(e) => updateSettings({ font: e.target.value })}
                    style={{ width: '100%' }}
                >
                    {fonts.map(f => (
                        <option key={f} value={f} style={{ fontFamily: f, color: '#333' }}>{f}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const Editor = () => {
    const [openSection, setOpenSection] = useState('settings');

    const sections = [
        { id: 'settings', title: 'Theme & Template', icon: Settings, component: <TemplateSettings /> },
        { id: 'atsChecker', title: 'AI ATS Resume Checker', icon: ShieldCheck, component: <AtsChecker /> },
        { id: 'personalInfo', title: 'Personal Information', icon: User, component: <PersonalInfoForm /> },
        { id: 'summary', title: 'Professional Summary', icon: FileText, component: <SummaryForm /> },
        { id: 'experience', title: 'Work Experience', icon: Briefcase, component: <ExperienceForm /> },
        { id: 'education', title: 'Education', icon: GraduationCap, component: <EducationForm /> },
        { id: 'skills', title: 'Skills', icon: Code, component: <SkillsForm /> },
        { id: 'projects', title: 'Personal Projects', icon: BookOpen, component: <ProjectsForm /> },
        { id: 'certifications', title: 'Certifications', icon: Award, component: <CertificationsForm /> },
        { id: 'achievements', title: 'Achievements', icon: Medal, component: <AchievementsForm /> },
    ];

    return (
        <div style={{ padding: '32px 24px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                Fill out your information below. The preview will update automatically.
            </p>

            {sections.map(section => (
                <AccordionItem
                    key={section.id}
                    title={section.title}
                    icon={section.icon}
                    isOpen={openSection === section.id}
                    onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
                >
                    {section.component}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Editor;
