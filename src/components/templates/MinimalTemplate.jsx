import React from 'react';

const MinimalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, settings, sectionOrder } = data;
    const themeColor = settings.themeColor;

    const SectionHeader = ({ title }) => (
        <div style={{ marginBottom: '16px', marginTop: '24px', textAlign: 'center' }}>
            <h2 style={{
                color: '#334155',
                fontSize: '1rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '3px',
                margin: 0,
                position: 'relative',
                display: 'inline-block'
            }}>
                {title}
                <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30px',
                    height: '2px',
                    backgroundColor: themeColor
                }}></div>
            </h2>
        </div>
    );

    const renderSummary = () => summary && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#4b5563', maxWidth: '90%', margin: '0 auto' }}>{summary}</p>
        </div>
    );

    const renderExperience = () => experience.length > 0 && (
        <div>
            {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{exp.title}</h3>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                            {exp.company} <span style={{ color: themeColor }}>•</span> {exp.location}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {exp.startDate} — {exp.endDate}
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: '8px 0 0', color: '#4b5563', textAlign: 'center' }}>{exp.description}</p>
                </div>
            ))}
        </div>
    );

    const renderEducation = () => education.length > 0 && (
        <div>
            {education.map((edu, idx) => (
                <div key={edu.id || idx} style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {edu.startDate} — {edu.endDate}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSkills = () => skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {skills.map((skill, idx) => (
                <span key={skill.id || idx} style={{
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                }}>
                    {skill.name}{idx < skills.length - 1 && '  /  '}
                </span>
            ))}
        </div>
    );

    const renderProjects = () => projects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{proj.name}</h3>
                    {proj.link && <div style={{ fontSize: '0.8rem', color: themeColor, fontWeight: 600 }}>{proj.link}</div>}
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: '4px 0 0', color: '#4b5563' }}>{proj.description}</p>
                </div>
            ))}
        </div>
    );

    const renderCertifications = () => certifications.length > 0 && (
        <div style={{ textAlign: 'center' }}>
            {certifications.map((cert, idx) => (
                <div key={cert.id || idx} style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cert.name}</span>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}> — {cert.issuer} ({cert.date})</span>
                </div>
            ))}
        </div>
    );

    const renderAchievements = () => achievements.length > 0 && (
        <div style={{ textAlign: 'center' }}>
            {achievements.map((ach, idx) => (
                <p key={ach.id || idx} style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#4b5563', margin: '0 0 6px' }}>
                    {ach.description}
                </p>
            ))}
        </div>
    );

    const sectionRenderers = {
        summary: { title: 'Profile', render: renderSummary },
        experience: { title: 'Experience', render: renderExperience },
        education: { title: 'Education', render: renderEducation },
        skills: { title: 'Experties', render: renderSkills },
        projects: { title: 'Projects', render: renderProjects },
        certifications: { title: 'Certifications', render: renderCertifications },
        achievements: { title: 'Achievements', render: renderAchievements },
    };

    return (
        <div style={{ width: '100%', height: '100%', padding: '0 20px' }}>
            {/* Header Section */}
            <header style={{
                textAlign: 'center',
                marginBottom: '40px'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    color: '#1e293b',
                    letterSpacing: '4px',
                    textTransform: 'uppercase'
                }}>
                    {personalInfo.firstName} <span style={{ fontWeight: 700 }}>{personalInfo.lastName}</span>
                </h1>
                <p style={{
                    margin: '8px 0 16px',
                    fontSize: '1rem',
                    color: themeColor,
                    fontWeight: 600,
                    letterSpacing: '3px',
                    textTransform: 'uppercase'
                }}>
                    {personalInfo.jobTitle}
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '1px'
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

export default MinimalTemplate;
