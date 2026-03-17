import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Files, 
  Award, 
  Globe, 
  HeartHandshake, 
  ScrollText,
  Users,
  ChevronDown
} from 'lucide-react';
import { useResumeStore } from '../../../store/useResumeStore';
import PersonalInfoForm from './sections/PersonalInfoForm';
import ProfessionalSummaryForm from './sections/ProfessionalSummaryForm';
import ExperienceForm from './sections/ExperienceForm';
import EducationForm from './sections/EducationForm';
import SkillsForm from './sections/SkillsForm';
import ProjectsForm from './sections/ProjectsForm';
import AwardsCertsForm from './sections/AwardsCertsForm';
import LanguagesForm from './sections/LanguagesForm';

const FormPanel = () => {
    const { resumeData } = useResumeStore();
    const [expandedSection, setExpandedSection] = useState<string | null>('personalInfo');

    const sections = [
        { id: 'personalInfo', label: 'Personal Information', icon: User },
        { id: 'summary', label: 'Professional Summary', icon: ScrollText },
        { id: 'experience', label: 'Work Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Wrench },
        { id: 'projects', label: 'Projects', icon: Files },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'languages', label: 'Languages', icon: Globe },
        { id: 'volunteer', label: 'Volunteer Work', icon: HeartHandshake },
        { id: 'references', label: 'References', icon: Users },
    ];

    return (
        <div className="space-y-4">
            {sections.map((section) => (
                <div key={section.id} className="group">
                    <button 
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${expandedSection === section.id ? 'bg-white border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-primary/10'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-all ${expandedSection === section.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 group-hover:text-primary border-slate-100'}`}>
                                <section.icon size={20} />
                            </div>
                            <span className={`font-bold text-sm uppercase tracking-tight transition-colors ${expandedSection === section.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{section.label}</span>
                        </div>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${expandedSection === section.id ? 'rotate-180 text-primary' : 'text-slate-300 group-hover:text-primary'}`}>
                             <ChevronDown size={20} />
                        </div>
                    </button>
                    
                    {expandedSection === section.id && (
                        <div className="p-6 mt-2 bg-white rounded-3xl border border-slate-100 shadow-inner">
                            {section.id === 'personalInfo' && <PersonalInfoForm />}
                            {section.id === 'summary' && <ProfessionalSummaryForm />}
                            {section.id === 'experience' && <ExperienceForm />}
                            {section.id === 'education' && <EducationForm />}
                            {section.id === 'skills' && <SkillsForm />}
                            {section.id === 'projects' && <ProjectsForm />}
                            {section.id === 'certifications' && <AwardsCertsForm section="certifications" label="Certification" />}
                            {section.id === 'awards' && <AwardsCertsForm section="awards" label="Award" />}
                            {section.id === 'languages' && <LanguagesForm />}
                            {!['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'languages'].includes(section.id) && (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                        <section.icon size={24} />
                                    </div>
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">{section.label} coming soon</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FormPanel;
