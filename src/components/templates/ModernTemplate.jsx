import React from 'react';

const ModernTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '12px', marginTop: '20px' }}>
            <h2 style={{
                color: themeColor,
                fontSize: '1.25rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: `2px solid ${themeColor}33`, // 20% opacity
                paddingBottom: '4px',
                marginBottom: '8px'
            }}>
                {title}
            </h2>
        </div>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#475569' }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{exp.title}</h3>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: themeColor }}>{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>{exp.company}</span>
                        <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#94a3b8' }}>{exp.location}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0, color: '#475569', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: themeColor }}>{edu.startDate} — {edu.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>{edu.school}</span>
                        <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#94a3b8' }}>{edu.location}</span>
                    </div>
                    {edu.description && <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0, color: '#475569' }}>{edu.description}</p>}
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((skill, idx) => (
                <span key={skill.id || idx} style={{
                    backgroundColor: `${themeColor}15`, // Very light theme color background
                    color: themeColor,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: `1px solid ${themeColor}22`
                }}>
                    {skill.name}
                </span>
            ))}
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
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0, color: '#475569' }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    const renderCertifications = () => certifications.length > 0 && (
        <div>
            {certifications.map((cert, idx) => (
                <div key={cert.id || idx} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cert.name}</span>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}> — {cert.issuer}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{cert.date}</span>
                </div>
            ))}
        </div>
    );

    const renderAchievements = () => achievements.length > 0 && (
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {achievements.map((ach, idx) => (
                <li key={ach.id || idx} style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569', marginBottom: '4px' }}>
                    {ach.description}
                </li>
            ))}
        </ul>
    );

    const sectionRenderers = {
        summary: { title: 'Personal Summary', render: renderSummary },
        experience: { title: 'Professional Experience', render: renderExperience },
        education: { title: 'Education', render: renderEducation },
        skills: { title: 'Core Skills', render: renderSkills },
        projects: { title: 'Featured Projects', render: renderProjects },
        certifications: { title: 'Certifications', render: renderCertifications },
        achievements: { title: 'Achievements', render: renderAchievements },
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Header Section */}
            <header style={{
                borderBottom: `4px solid ${themeColor}`,
                paddingBottom: '20px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
            }}>
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: '#1e293b',
                        letterSpacing: '-1px',
                        lineHeight: 1
                    }}>
                        {personalInfo.firstName} <span style={{ color: themeColor }}>{personalInfo.lastName}</span>
                    </h1>
                    <p style={{
                        margin: '8px 0 0',
                        fontSize: '1.25rem',
                        color: '#64748b',
                        fontWeight: 500
                    }}>
                        {personalInfo.jobTitle}
                    </p>
                </div>

                <div style={{ textAlign: 'right', color: '#475569', fontSize: '0.85rem' }}>
                    <div>{personalInfo.email}</div>
                    <div>{personalInfo.phone}</div>
                    <div>{personalInfo.location}</div>
                    {personalInfo.linkedin && (
                        <div style={{ fontWeight: 600, color: themeColor }}>{personalInfo.linkedin}</div>
                    )}
                </div>
            </header>

            {/* Dynamic Sections Based on User-defined Order */}
            {sectionOrder.map((sectionId) => {
                const config = sectionRenderers[sectionId];
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

export default ModernTemplate;
