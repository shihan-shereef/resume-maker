import React from 'react';

const TraditionalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '12px', marginTop: '24px', textAlign: 'center' }}>
            <h2 style={{
                color: '#1e293b',
                fontSize: '1.25rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                borderBottom: `2.5px double #cbd5e1`,
                paddingBottom: '2px',
                display: 'inline-block'
            }}>
                {title}
            </h2>
        </div>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#111827', fontStyle: 'italic', textAlign: 'center' }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{exp.company}</h3>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{exp.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 600, fontStyle: 'italic', color: '#64748b' }}>{exp.title}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0, color: '#111827' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{edu.school}</h3>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{edu.startDate} — {edu.endDate}</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontStyle: 'italic', color: '#64748b' }}>{edu.degree}</div>
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', color: '#111827', margin: 0 }}>
                {skills.map((skill, idx) => (
                    <span key={skill.id || idx}>
                        {skill.name}{idx < skills.length - 1 && '  /  '}
                    </span>
                ))}
            </p>
        </div>
    );

    const renderProjects = () => projects.length > 0 && (
        <div>
            {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{proj.name}</h3>
                        {proj.link && <span style={{ fontSize: '0.85rem', color: themeColor }}>{proj.link}</span>}
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0, color: '#111827' }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100%', fontFamily: "'Times New Roman', serif" }}>
            {/* Traditional Header */}
            <header style={{
                textAlign: 'center',
                borderBottom: `1.5px solid #1e293b`,
                paddingBottom: '20px',
                marginBottom: '20px'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '2.5rem',
                    fontWeight: 400,
                    color: '#1e293b',
                    textTransform: 'uppercase'
                }}>
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <p style={{
                    margin: '8px 0 12px',
                    fontSize: '1rem',
                    color: '#64748b',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}>
                    {personalInfo.jobTitle}
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    color: '#111827',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    <span>{personalInfo.email}</span>
                    <span>•</span>
                    <span>{personalInfo.phone}</span>
                    <span>•</span>
                    <span>{personalInfo.location}</span>
                </div>
            </header>

            {/* Dynamic Sections */}
            {sectionOrder.map((sectionId) => {
                const config = {
                    summary: { title: 'Executive Summary', render: renderSummary },
                    experience: { title: 'Legal & Professional Experience', render: renderExperience },
                    education: { title: 'Education Background', render: renderEducation },
                    skills: { title: 'Core Skills', render: renderSkills },
                    projects: { title: 'Key Engagements', render: renderProjects },
                }[sectionId];
                if (!config) return null;
                const content = config.render();
                if (!content) return null;

                return (
                    <div key={sectionId}>
                        <SectionHeader title={config.title} />
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default TraditionalTemplate;
