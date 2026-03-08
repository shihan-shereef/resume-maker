import React from 'react';

const ProfessionalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '10px', marginTop: '18px' }}>
            <h2 style={{
                color: '#1e293b',
                fontSize: '1.2rem',
                fontWeight: 700,
                borderBottom: `1px solid #1e293b`,
                paddingBottom: '2px',
                marginBottom: '6px'
            }}>
                {title}
            </h2>
        </div>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '18px' }}>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#334155', margin: 0 }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{exp.company}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{exp.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, fontStyle: 'italic' }}>{exp.title}</span>
                        <span style={{ fontSize: '0.85rem' }}>{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.4, margin: '4px 0 0', color: '#475569' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{edu.school}</span>
                        <span style={{ fontSize: '0.85rem' }}>{edu.startDate} — {edu.endDate}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, fontStyle: 'italic' }}>{edu.degree}</div>
                    {edu.description && <p style={{ fontSize: '0.85rem', lineHeight: 1.4, margin: '4px 0 0', color: '#475569' }}>{edu.description}</p>}
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ fontSize: '0.9rem', color: '#334155' }}>
            <strong>Skills:</strong> {skills.map(s => s.name).join(', ')}
        </div>
    );

    const renderProjects = () => projects.length > 0 && (
        <div>
            {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{proj.name}</span>
                        {proj.link && <span style={{ fontSize: '0.8rem', color: themeColor }}>{proj.link}</span>}
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.4, margin: '2px 0 0', color: '#475569' }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    const renderCertifications = () => certifications.length > 0 && (
        <div style={{ fontSize: '0.9rem', color: '#334155' }}>
            {certifications.map((cert, idx) => (
                <div key={cert.id || idx} style={{ marginBottom: '4px' }}>
                    <strong>{cert.name}</strong>, {cert.issuer} ({cert.date})
                </div>
            ))}
        </div>
    );

    const renderAchievements = () => achievements.length > 0 && (
        <ul style={{ paddingLeft: '18px', margin: 0 }}>
            {achievements.map((ach, idx) => (
                <li key={ach.id || idx} style={{ fontSize: '0.9rem', lineHeight: 1.4, color: '#334155', marginBottom: '2px' }}>
                    {ach.description}
                </li>
            ))}
        </ul>
    );

    const sectionRenderers = {
        summary: { title: 'Work Summary', render: renderSummary },
        experience: { title: 'Work Experience', render: renderExperience },
        education: { title: 'Education History', render: renderEducation },
        skills: { title: 'Professional Skills', render: renderSkills },
        projects: { title: 'Key Projects', render: renderProjects },
        certifications: { title: 'Certifications', render: renderCertifications },
        achievements: { title: 'Achievements', render: renderAchievements },
    };

    return (
        <div style={{ width: '100%', height: '100%', padding: '0 5mm' }}>
            <header style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #333', paddingBottom: '16px' }}>
                <h1 style={{ margin: '0 0 4px', fontSize: '2.4rem', fontWeight: 700, color: '#000', textTransform: 'uppercase' }}>
                    {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <p style={{ margin: '0 0 10px', fontSize: '1.2rem', color: themeColor || '#444', fontWeight: 700, textTransform: 'uppercase' }}>
                    {personalInfo.jobTitle}
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.9rem',
                    color: '#000',
                    fontWeight: 500
                }}>
                    <span>{personalInfo.email}</span>
                    <span>•</span>
                    <span>{personalInfo.phone}</span>
                    <span>•</span>
                    <span>{personalInfo.location}</span>
                    {personalInfo.linkedin && (
                        <>
                            <span>•</span>
                            <span>{personalInfo.linkedin}</span>
                        </>
                    )}
                </div>
            </header>

            {sectionOrder.map((sectionId) => {
                const config = sectionRenderers[sectionId];
                if (!config) return null;
                const content = config.render();
                if (!content) return null;
                return (
                    <div key={sectionId} style={{ marginBottom: '16px' }}>
                        <SectionHeader title={config.title} />
                        {content}
                    </div>
                );
            })}
        </div>
    );
};

export default ProfessionalTemplate;
